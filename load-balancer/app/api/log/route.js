export const runtime = "nodejs";

import { addLog } from "../../_store/logs";

export async function POST(req) {
  try {
    const entry = await req.json();

    addLog({
      ts: entry.ts || new Date().toISOString(),
      attack_score: Number(entry.attack_score),
      decision: entry.decision,
      chosen_backend: entry.chosen_backend ?? null,

      // ✅ use || so "" doesn't win
      src_ip: entry.src_ip || entry.meta?.src_ip || null,
      path: entry.path || entry.meta?.path || null,
      ua: entry.ua || entry.meta?.ua || null,
    });

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 400 }
    );
  }
}
