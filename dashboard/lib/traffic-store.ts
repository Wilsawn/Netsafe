export type Decision = "ALLOW" | "REROUTE" | "BLOCK" | string;

export type Point = {
  t: number;       // epoch seconds
  time: string;    // HH:MM:SS
  allow: number;
  bot: number;
  total: number;
};

type Store = {
  history: Point[];
  lastSavedAt: number;
};

const KEY = "safenet_traffic_history_v1";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}
function formatHHMMSS(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

let store: Store = { history: [], lastSavedAt: 0 };

export function loadTrafficStoreFromSession() {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Store;
    if (Array.isArray(parsed.history)) store.history = parsed.history;
  } catch {
    // ignore
  }
}

export function saveTrafficStoreToSession(throttleMs = 1500) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - store.lastSavedAt < throttleMs) return;
  store.lastSavedAt = now;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function getTrafficHistory() {
  return store.history;
}

export function mergeRecentIntoHistory(
  recent: Array<{ ts: string; decision: Decision }>,
  historySeconds: number
) {
  const buckets = new Map<number, { allow: number; bot: number }>();

  for (const e of recent) {
    const sec = Math.floor(new Date(e.ts).getTime() / 1000);
    if (!buckets.has(sec)) buckets.set(sec, { allow: 0, bot: 0 });
    const b = buckets.get(sec)!;
    if (e.decision === "ALLOW") b.allow += 1;
    else b.bot += 1;
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const startSec = nowSec - 5; // smooth fill

  const bySec = new Map<number, Point>();
  for (const p of store.history) bySec.set(p.t, p);

  for (let sec = startSec; sec <= nowSec; sec++) {
    const counts = buckets.get(sec) ?? { allow: 0, bot: 0 };
    const total = counts.allow + counts.bot;

    bySec.set(sec, {
      t: sec,
      time: formatHHMMSS(new Date(sec * 1000)),
      allow: counts.allow,
      bot: counts.bot,
      total,
    });
  }

  const minKeep = nowSec - historySeconds;
  store.history = Array.from(bySec.values())
    .filter((p) => p.t >= minKeep)
    .sort((a, b) => a.t - b.t);
}
