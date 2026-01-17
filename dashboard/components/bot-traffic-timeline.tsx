"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useLiveStats } from "@/lib/useLiveStats";

type Point = {
  t: number;
  time: string;
  total: number;
  allow: number;
  bot: number; // REROUTE + BLOCK
};

const chartConfig = {
  blocked: { label: "Blocked/Rerouted", color: "hsl(0, 85%, 55%)" },
  allowed: { label: "Allowed", color: "hsl(45, 100%, 50%)" },
};

export function BotTrafficTimeline() {
  const { data, error } = useLiveStats(1000);

  // Use the 10-minute bucketed series from /api/stats
  const trafficData = useMemo(() => {
    const series: Point[] = (data as any)?.series10m ?? [];
    return series.map((p) => ({
      time: p.time,
      blocked: p.bot,   // currently bot = REROUTE+BLOCK
      allowed: p.allow, // allow = ALLOW
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Traffic - Last 10 Minutes</CardTitle>
        <CardDescription>Stacked view of blocked/rerouted vs allowed requests</CardDescription>
      </CardHeader>

      <CardContent>
        {error ? (
          <div className="mb-4 rounded-md border p-3 text-sm text-red-500">
            Stats error: {error}
          </div>
        ) : null}

        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0.1} />
                </linearGradient>

                <linearGradient id="allowedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                interval={20} // fewer labels
              />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />

              <Area
                type="monotone"
                dataKey="blocked"
                stackId="1"
                stroke="hsl(0, 85%, 55%)"
                fill="url(#blockedGradient)"
                name="Blocked/Rerouted"
                isAnimationActive={false} // keep it stable
              />
              <Area
                type="monotone"
                dataKey="allowed"
                stackId="1"
                stroke="hsl(45, 100%, 50%)"
                fill="url(#allowedGradient)"
                name="Allowed"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
