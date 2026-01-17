"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity, Shield, Zap } from "lucide-react";
import { useMemo } from "react";
import { useLiveStats } from "@/lib/useLiveStats";

export function DashboardMetrics() {
  const { data, error } = useLiveStats(500);

  const totals = data?.totals ?? { ALLOW: 0, REROUTE: 0, BLOCK: 0 };
  const series10s = data?.series10s ?? [];

  const totalRequests = totals.ALLOW + totals.REROUTE + totals.BLOCK;

  // avg RPS over last 10 seconds
  const rps = useMemo(() => {
    if (series10s.length === 0) return 0;
    const sum = series10s.reduce((acc, p) => acc + (p.total ?? 0), 0);
    return sum / 10;
  }, [series10s]);

  // bot % = (reroute+block) / total
  const botPct = totalRequests > 0 ? ((totals.REROUTE + totals.BLOCK) / totalRequests) * 100 : 0;

  const metrics = [
    { label: "Total Requests", value: totalRequests.toLocaleString(), icon: TrendingUp },
    { label: "Requests/Second", value: rps.toFixed(1), icon: Activity },
    { label: "Bot Rate", value: `${botPct.toFixed(1)}%`, icon: Shield },
    { label: "Avg Response Time", value: "—", icon: Zap }, // you can add later if you track latency
  ];

  return (
    <div>
      {error ? (
        <div className="mb-4 rounded-md border p-3 text-sm text-red-500">
          Stats error: {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <m.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
