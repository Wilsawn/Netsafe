export const runtime = "nodejs";

export async function GET() {
  const base = process.env.LOAD_BALANCER_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/stats`, { cache: "no-store" });
  const data = await res.json();

  return Response.json(data, {
    status: res.status,
    headers: { "Cache-Control": "no-store" },
  });
}
