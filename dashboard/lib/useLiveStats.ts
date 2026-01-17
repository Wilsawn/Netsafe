"use client";

import { useEffect, useState } from "react";

export type LiveStatEvent = {
  ts: string;
  attack_score: number;
  decision: "ALLOW" | "REROUTE" | "BLOCK" | string;
  chosen_backend: "A" | "B" | "C" | null;

  // ✅ add these
  src_ip?: string | null;
  path?: string | null;
  ua?: string | null;
};

export type Point = {
  t: number;
  time: string;
  total: number;
  allow: number;
  bot: number;
};

export type LiveStats = {
  totals: { ALLOW: number; REROUTE: number; BLOCK: number };
  per_backend: { A: number; B: number; C: number };

  recent: LiveStatEvent[];
  recent_count?: number;

  // ✅ if your /api/stats returns these
  series10s?: Point[];
  series10m?: Point[];
};

export function useLiveStats(pollMs = 1000) {
  const [data, setData] = useState<LiveStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function tick() {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to fetch /api/stats");
        if (alive) {
          setData(json);
          setError(null);
        }
      } catch (e: any) {
        if (alive) setError(e?.message || "Unknown error");
      }
    }

    tick();
    const id = setInterval(tick, pollMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return { data, error };
}
