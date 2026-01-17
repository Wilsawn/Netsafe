export const runtime = "nodejs"; // serverless/node runtime

import { getLogsSnapshot } from "../../_store/logs";

export async function GET() {
  const snapshot = getLogsSnapshot();
  return Response.json(snapshot);
}
