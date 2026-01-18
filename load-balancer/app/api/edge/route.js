export const runtime = "edge";

import scaler from "../../../model/scaler.json";
import model from "../../../model/model_weights.json";

const FEATURE_ORDER = [
  "dur",
  "spkts",
  "dpkts",
  "sbytes",
  "dbytes",
  "rate",
  "sload",
  "dload",
  "sinpkt",
  "dinpkt",
  "sjit",
  "djit",
];

// RENDER_URLS env example:
// https://netsafe1.onrender.com/ingest,https://netsafe2.onrender.com/ingest,https://netsafe3.onrender.com/ingest
function getBackends() {
  const raw = process.env.RENDER_URLS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Edge-safe stable chooser (no broken in-memory round robin)
function chooseBackendStable(key, backends) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return backends[Math.abs(hash) % backends.length];
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function scoreFlow(flow) {
  const mean = scaler.mean;
  const scale = scaler.scale;
  const weights = model.weights;
  const bias = model.bias;

  let z = bias;

  for (let i = 0; i < FEATURE_ORDER.length; i++) {
    const key = FEATURE_ORDER[i];
    const raw = Number(flow?.[key]);
    if (!Number.isFinite(raw)) throw new Error(`Missing/non-numeric feature: ${key}`);

    const xNorm = (raw - mean[i]) / scale[i];
    z += weights[i] * xNorm;
  }

  return sigmoid(z);
}

function decide(score) {
  if (score >= 0.85) return "BLOCK";
  if (score >= 0.60) return "REROUTE";
  return "ALLOW";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const flow = body?.flow;
    const meta = body?.meta ?? null;

    const attack_score = scoreFlow(flow);
    const decision = decide(attack_score);

    const backends = getBackends();

    let chosen_backend = null;
    let render_status = null;

    if (decision === "ALLOW" && backends.length > 0) {
      const key = meta?.src_ip || crypto.randomUUID();
      chosen_backend = chooseBackendStable(key, backends);

      // Forward to Render receiver (/ingest)
      const resp = await fetch(chosen_backend, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-edge-secret": process.env.EDGE_SHARED_SECRET || "",
        },
        body: JSON.stringify({ flow, meta, attack_score }),
      });

      render_status = resp.status;
    }

    // Optional internal logging route (remove if you don't have /api/log)
    await fetch(new URL("/api/log", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ts: new Date().toISOString(),
        attack_score,
        decision,
        chosen_backend,
        render_status,
        meta,
      }),
    });

    return Response.json({
      attack_score,
      decision,
      chosen_backend,
      render_status,
      backends_loaded: backends.length,
      has_secret: Boolean(process.env.EDGE_SHARED_SECRET),
    });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Unknown error" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const backends = getBackends();
  return Response.json({
    ok: true,
    message: "POST { flow: {...}, meta: {...} } to get attack_score + decision + chosen_backend",
    feature_order: FEATURE_ORDER,
    backends_loaded: backends.length,
    has_secret: Boolean(process.env.EDGE_SHARED_SECRET),
    // Helpful reminder of what the backend URL should look like:
    expected_backend_example: "https://netsafe1.onrender.com/ingest",
  });
}
