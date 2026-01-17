// load-balancer/app/_store/logs.js
// In-memory telemetry store (dev/demo). Resets on server restart.

let totals = { ALLOW: 0, REROUTE: 0, BLOCK: 0 };
let per_backend = { A: 0, B: 0, C: 0 };

// Keep last N table rows (for UI table, not for chart)
let recentLogs = []; // newest first
const RECENT_CAP = 2000;

// Per-second buckets for last 10 minutes
const HISTORY_SECONDS = 10 * 60; // 600
// buckets: { [epochSec]: { total, allow, bot } }
let buckets = new Map();

function bumpBucket(epochSec, decision) {
  const prev = buckets.get(epochSec) || { total: 0, allow: 0, bot: 0 };
  prev.total += 1;
  if (decision === "ALLOW") prev.allow += 1;
  else prev.bot += 1; // REROUTE+BLOCK
  buckets.set(epochSec, prev);

  // prune old buckets
  const minKeep = epochSec - HISTORY_SECONDS;
  for (const k of buckets.keys()) {
    if (k < minKeep) buckets.delete(k);
  }
}

export function addLog(entry) {
  const ts = entry.ts || new Date().toISOString();
  const decision = entry.decision;

  const clean = {
    ts,
    attack_score: Number(entry.attack_score),
    decision,
    chosen_backend: entry.chosen_backend ?? null,
    src_ip: entry.src_ip ?? null,
    path: entry.path ?? null,
    ua: entry.ua ?? null,
  };

  // keep recent table logs
  recentLogs.unshift(clean);
  if (recentLogs.length > RECENT_CAP) recentLogs.pop();

  // totals
  if (decision && totals[decision] !== undefined) totals[decision] += 1;

  // backend counts
  if (clean.chosen_backend && per_backend[clean.chosen_backend] !== undefined) {
    per_backend[clean.chosen_backend] += 1;
  }

  // per-second bucket (for chart)
  const epochSec = Math.floor(new Date(ts).getTime() / 1000);
  bumpBucket(epochSec, decision);
}

function bucketsToSeries() {
  // return continuous series for last 10 minutes (fills missing seconds with 0)
  const nowSec = Math.floor(Date.now() / 1000);
  const start = nowSec - HISTORY_SECONDS + 1;

  const series = [];
  for (let t = start; t <= nowSec; t++) {
    const v = buckets.get(t) || { total: 0, allow: 0, bot: 0 };
    const d = new Date(t * 1000);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    series.push({
      t,
      time: `${hh}:${mm}:${ss}`,
      total: v.total,
      allow: v.allow,
      bot: v.bot,
    });
  }
  return series;
}

export function getLogsSnapshot() {
  const series10m = bucketsToSeries();
  const series10s = series10m.slice(-10);

  return {
    totals,
    per_backend,
    // Chart data (aggregated)
    series10m,
    series10s,
    // Table data (still capped, but you can raise RECENT_CAP)
    recent: recentLogs,
    recent_count: recentLogs.length,
  };
}

export function resetLogs() {
  totals = { ALLOW: 0, REROUTE: 0, BLOCK: 0 };
  per_backend = { A: 0, B: 0, C: 0 };
  recentLogs = [];
  buckets = new Map();
}
