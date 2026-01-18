export const runtime = "nodejs";

import { addLog } from "../../_store/logs";

export async function POST(req) {
  try {
    const entry = await req.json();

    // Helper: only accept non-empty strings
    const pickStr = (...vals) => {
      for (const v of vals) {
        if (typeof v === "string" && v.trim().length > 0) return v.trim();
      }
      return null;
    };

    // Helper: coerce number safely
    const toNumOrNull = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    addLog({
      ts:
        typeof entry?.ts === "string" && entry.ts.trim()
          ? entry.ts.trim()
          : new Date().toISOString(),

      attack_score: toNumOrNull(entry?.attack_score),
      decision: typeof entry?.decision === "string" ? entry.decision : null,
      chosen_backend:
        typeof entry?.chosen_backend === "string" && entry.chosen_backend.trim()
          ? entry.chosen_backend.trim()
          : null,

      // Prefer top-level fields, fall back to meta
      src_ip: pickStr(entry?.src_ip, entry?.meta?.src_ip),
      path: pickStr(entry?.path, entry?.meta?.path),
      ua: pickStr(entry?.ua, entry?.meta?.ua),
    });

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 400 }
    );
  }
}
