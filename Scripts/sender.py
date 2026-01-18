import csv
import random
import time
from typing import Dict, Any, List
import os

import requests


# ========= CONFIG (change these) =========
EDGE_URL = "http://localhost:3000/api/edge"   # your Vercel dev API
CSV_PATH = "UNSW-NB15_clean.csv"              # path to your cleaned dataset

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "UNSW-NB15_clean.csv")


NUM_ROWS_TO_SEND = 2000                  # <-- how many rows to send total
SLEEP_SECONDS = 0.05                          # 0.00 = max speed, 0.05 nice for dashboard

# Probability that a request is "bot-like" (affects UA + IP selection bias)
BOT_PROB = 0.35
# ========================================


FLOW_COLS = [
    "dur", "spkts", "dpkts", "sbytes", "dbytes", "rate",
    "sload", "dload", "sinpkt", "dinpkt", "sjit", "djit"
]

PATHS = ["/api/login", "/api/users", "/api/orders", "/api/search", "/api/checkout"]

LEGIT_UAS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "Mozilla/5.0 (X11; Linux x86_64)",
]

BOT_UAS = [
    "Bot/1.0",
    "curl/8.0",
    "python-requests/2.x",
]

# ========= BIG IP POOL + REUSE (tune these) =========
POOL_SIZE = 5000
HOT_SET_SIZE = 30
RECENT_WINDOW = 250

# pick probabilities
P_HOT = 0.55      # 55% from hot attackers (repeat a lot)
P_RECENT = 0.25   # 25% from recently seen IPs (some reuse)
# remaining 20% from random in full pool

# internal state
_recent: List[str] = []
IP_POOL: List[str] = []
HOT_IPS: List[str] = []


def rand_public_ip() -> str:
    # Avoid private/reserved-ish ranges (roughly) so it looks realistic
    while True:
        a = random.randint(1, 223)
        b = random.randint(0, 255)
        c = random.randint(0, 255)
        d = random.randint(1, 254)

        # skip common private ranges / loopback
        if a == 10:
            continue
        if a == 172 and 16 <= b <= 31:
            continue
        if a == 192 and b == 168:
            continue
        if a == 127:
            continue

        return f"{a}.{b}.{c}.{d}"


def init_ip_pools():
    global IP_POOL, HOT_IPS
    IP_POOL = [rand_public_ip() for _ in range(POOL_SIZE)]
    HOT_IPS = random.sample(IP_POOL, min(HOT_SET_SIZE, len(IP_POOL)))


def pick_ip() -> str:
    global _recent

    r = random.random()
    if r < P_HOT:
        ip = random.choice(HOT_IPS)
    elif r < P_HOT + P_RECENT and _recent:
        ip = random.choice(_recent)
    else:
        ip = random.choice(IP_POOL)

    _recent.append(ip)
    if len(_recent) > RECENT_WINDOW:
        _recent.pop(0)

    return ip
# =====================================================


def to_number(x: str):
    """Convert CSV string to float/int safely."""
    if x is None:
        return 0.0
    s = str(x).strip()
    if s == "" or s.lower() in {"nan", "none"}:
        return 0.0
    try:
        v = float(s)  # supports 2.00E-06 etc
        if v.is_integer():
            return int(v)
        return v
    except ValueError:
        return 0.0


def build_meta() -> Dict[str, Any]:
    bot_like = random.random() < BOT_PROB
    src_ip = pick_ip()

    return {
        "src_ip": src_ip,
        "path": random.choice(PATHS),
        "ua": random.choice(BOT_UAS) if bot_like else random.choice(LEGIT_UAS),
        "is_bot_like": bot_like,  # optional
    }


def row_to_flow(row: Dict[str, str]) -> Dict[str, Any]:
    flow = {}
    for c in FLOW_COLS:
        if c not in row:
            raise KeyError(f"Missing column '{c}' in CSV. Found columns: {list(row.keys())[:20]}...")
        flow[c] = to_number(row[c])
    return flow


def main():
    init_ip_pools()

    sent = 0
    ok = 0
    failed = 0

    with open(CSV_PATH, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows: List[Dict[str, str]] = list(reader)

    if not rows:
        raise RuntimeError("CSV appears empty or unreadable.")

    i = 0
    while sent < NUM_ROWS_TO_SEND:
        row = rows[i % len(rows)]
        i += 1

        payload = {
            "flow": row_to_flow(row),
            "meta": build_meta(),
        }

        try:
            r = requests.post(EDGE_URL, json=payload, timeout=10)
            if r.ok:
                ok += 1
            else:
                failed += 1
                print(f"[{sent}] HTTP {r.status_code}: {r.text[:200]}")
        except Exception as e:
            failed += 1
            print(f"[{sent}] request failed: {e}")

        sent += 1
        if SLEEP_SECONDS > 0:
            time.sleep(SLEEP_SECONDS)

    print("\n=== Replay complete ===")
    print(f"Sent:   {sent}")
    print(f"OK:     {ok}")
    print(f"Failed: {failed}")
    print(f"Target: {EDGE_URL}")


if __name__ == "__main__":
    main()
