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

// Static round-robin: A -> B -> C -> A ...
let rrIndex = 0;
const BACKENDS = ["A", "B", "C"];
function chooseBackendStatic() {
  const chosen = BACKENDS[rrIndex % BACKENDS.length];
  rrIndex += 1;
  return chosen;
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

    // ✅ meta is what your python sender uses: {src_ip, path, ua, ...}
    const meta = body?.meta ?? null;

    const attack_score = scoreFlow(flow);
    const decision = decide(attack_score);

    let chosen_backend = null;
    if (decision === "ALLOW") {
      chosen_backend = chooseBackendStatic();
    }

    // ✅ Log via Node route (so /api/stats can see it)
    await fetch(new URL("/api/log", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ts: new Date().toISOString(),
        attack_score,
        decision,
        chosen_backend,

        // ✅ forward meta so /api/log can store src_ip/path/ua
        meta,
      }),
    });

    return Response.json({ attack_score, decision, chosen_backend });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Unknown error" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    message: "POST { flow: {...}, meta: {...} } to get attack_score + decision + chosen_backend",
    feature_order: FEATURE_ORDER,
  });
}
