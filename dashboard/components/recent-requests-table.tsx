"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLiveStats } from "@/lib/useLiveStats";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour12: false });
}

function decisionBadge(decision: string) {
  if (decision === "BLOCK") return <Badge variant="destructive">BLOCK</Badge>;
  if (decision === "REROUTE") return <Badge variant="secondary">REROUTE</Badge>;
  return (
    <Badge
      variant="outline"
      className="border-green-500 text-green-600 dark:text-green-400"
    >
      ALLOW
    </Badge>
  );
}

export function RecentRequestsTable() {
  const { data, error } = useLiveStats(1000);

  const rows = data?.recent ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Requests</CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-md border p-3 text-sm text-red-500">
            Stats error: {error}
          </div>
        )}

        {/* Scroll container */}
        <div className="max-h-[420px] overflow-y-auto rounded-md border">
          <Table>
            {/* Sticky header */}
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Src IP</TableHead>
                <TableHead>Attack Score</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Backend</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-6 text-center"
                  >
                    No requests yet — send traffic to{" "}
                    <span className="font-mono text-primary">/api/edge</span>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r, index) => (
                  <TableRow
                    key={`${r.ts}-${index}`}
                    className={index % 2 === 0 ? "bg-muted/50" : ""}
                  >
                    <TableCell className="font-mono text-sm">
                      {formatTime(r.ts)}
                    </TableCell>

                    <TableCell className="font-mono text-sm">
                      {r.src_ip ?? "—"}
                    </TableCell>

                    <TableCell className="font-mono text-sm">
                      {Number(r.attack_score).toFixed(3)}
                    </TableCell>

                    <TableCell>{decisionBadge(r.decision)}</TableCell>

                    <TableCell className="font-mono text-sm">
                      {r.chosen_backend ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Note: <span className="font-mono">Src IP</span> shows your simulated IP from the replay script.
          (Make sure your <span className="font-mono">/api/log</span> route stores it.)
        </p>
      </CardContent>
    </Card>
  );
}
