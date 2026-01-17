"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Ban, CheckCircle, Target } from "lucide-react";
import { useLiveStats } from "@/lib/useLiveStats";

function percent(part: number, total: number) {
  if (total === 0) return "0%";
  return ((part / total) * 100).toFixed(1) + "%";
}

export function BotDetectionStats() {
  const { data, error } = useLiveStats(1000);

  const allow = data?.totals.ALLOW ?? 0;
  const reroute = data?.totals.REROUTE ?? 0;
  const block = data?.totals.BLOCK ?? 0;

  const bots = reroute + block;
  const total = allow + bots;

  const stats = [
    {
      label: "Total Bots Detected",
      value: bots.toLocaleString(),
      icon: ShieldAlert,
    },
    {
      label: "Blocked Requests",
      value: block.toLocaleString(),
      icon: Ban,
    },
    {
      label: "Allowed Requests",
      value: allow.toLocaleString(),
      icon: CheckCircle,
    },
    {
      label: "Detection Rate",
      value: percent(bots, total),
      icon: Target,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {error && (
        <div className="col-span-full rounded-md border p-3 text-sm text-red-500">
          Stats error: {error}
        </div>
      )}

      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
