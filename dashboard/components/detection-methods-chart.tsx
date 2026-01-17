"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useLiveStats } from "@/lib/useLiveStats";

const COLORS = {
  blocked: "hsl(0, 85%, 55%)",
  reroute: "hsl(25, 95%, 55%)",
  A: "hsl(210, 100%, 50%)",
  B: "hsl(145, 70%, 45%)",
  C: "hsl(270, 70%, 55%)",
};

export function DetectionMethodsChart() {
  const { data, error } = useLiveStats(1000);

  const pieData = useMemo(() => {
    if (!data) return [];

    const blocked = data.totals?.BLOCK ?? 0;
    const reroute = data.totals?.REROUTE ?? 0;

    const backendA = data.per_backend?.A ?? 0;
    const backendB = data.per_backend?.B ?? 0;
    const backendC = data.per_backend?.C ?? 0;

    return [
      { name: "Blocked", value: blocked, color: COLORS.blocked },
      { name: "Rerouted", value: reroute, color: COLORS.reroute },
      { name: "Allowed → Backend A", value: backendA, color: COLORS.A },
      { name: "Allowed → Backend B", value: backendB, color: COLORS.B },
      { name: "Allowed → Backend C", value: backendC, color: COLORS.C },
    ].filter((x) => x.value > 0); // hide empty slices
  }, [data]);

  const chartConfig = {
    blocked: { label: "Blocked", color: COLORS.blocked },
    reroute: { label: "Rerouted", color: COLORS.reroute },
    A: { label: "Backend A", color: COLORS.A },
    B: { label: "Backend B", color: COLORS.B },
    C: { label: "Backend C", color: COLORS.C },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Decisions</CardTitle>
        <CardDescription>Live breakdown of routing and blocking actions</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-md border p-3 text-sm text-red-500">
            Stats error: {error}
          </div>
        )}

        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>

              <ChartTooltip content={<ChartTooltipContent />} />

              <Legend
                verticalAlign="bottom"
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
