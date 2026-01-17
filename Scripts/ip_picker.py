import random

# ---- config knobs ----
POOL_SIZE = 5000
HOT_SET_SIZE = 25
RECENT_WINDOW = 200

P_HOT = 0.55       # 55% from hot attackers (repeat a lot)
P_RECENT = 0.25    # 25% reuse from recently seen
# remaining 20% = random new-ish from large pool

# ---- build big pool ----
def rand_public_ip():
    # avoid private/reserved ranges roughly
    while True:
        a = random.randint(1, 223)
        b = random.randint(0, 255)
        c = random.randint(0, 255)
        d = random.randint(1, 254)

        # skip private ranges
        if a == 10: 
            continue
        if a == 172 and 16 <= b <= 31:
            continue
        if a == 192 and b == 168:
            continue
        if a == 127:
            continue
        return f"{a}.{b}.{c}.{d}"

IP_POOL = [rand_public_ip() for _ in range(POOL_SIZE)]
HOT_IPS = random.sample(IP_POOL, HOT_SET_SIZE)

_recent = []  # recent history list

def pick_ip():
    global _recent

    r = random.random()

    if r < P_HOT:
        ip = random.choice(HOT_IPS)

    elif r < P_HOT + P_RECENT and _recent:
        ip = random.choice(_recent)

    else:
        ip = random.choice(IP_POOL)

    # track recency (so reuse is possible)
    _recent.append(ip)
    if len(_recent) > RECENT_WINDOW:
        _recent.pop(0)

    return ip
