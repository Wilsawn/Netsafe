"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLiveStats } from "@/lib/useLiveStats";

type SourceRow = {
  ip: string;
  count: number;
  blocked: number;
};

export function TopBotSourcesTable() {
  const { data } = useLiveStats(1000);

  const sources = useMemo(() => {
    const map = new Map<string, SourceRow>();

    for (const r of data?.recent ?? []) {
      if (!r.src_ip) continue;

      const prev = map.get(r.src_ip) || {
        ip: r.src_ip,
        count: 0,
        blocked: 0,
      };

      prev.count += 1;
      if (r.decision === "BLOCK") prev.blocked += 1;

      map.set(r.src_ip, prev);
    }

    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  const maxRequests = Math.max(...sources.map((s) => s.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Bot Sources</CardTitle>
        <CardDescription>Most active attacking IP addresses</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead className="w-28">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                  No traffic yet
                </TableCell>
              </TableRow>
            ) : (
              sources.map((s, i) => {
                const blockedRatio = s.blocked / s.count;
                const status = blockedRatio > 0.5 ? "blocked" : "monitored";

                return (
                  <TableRow key={s.ip}>
                    <TableCell className="font-medium">{i + 1}</TableCell>

                    <TableCell className="font-mono text-sm">
                      {s.ip}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-destructive"
                            style={{
                              width: `${(s.count / maxRequests) * 100}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm text-muted-foreground">
                          {s.count.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={status === "blocked" ? "destructive" : "secondary"}
                      >
                        {status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
