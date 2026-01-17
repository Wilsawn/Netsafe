"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { useLiveStats } from "@/lib/useLiveStats";

const chartConfig = {
  total: { label: "Total", color: "hsl(210, 100%, 50%)" },
  allow: { label: "Allow", color: "hsl(145, 70%, 45%)" },
  bot: { label: "Bot", color: "hsl(0, 85%, 55%)" },
};

type Point = {
  t: number;
  time: string;
  total: number;
  allow: number;
  bot: number;
};

type Mode = "live" | "history";

export function TrafficChart() {
  // fast refresh so live feels live
  const { data, error } = useLiveStats(250);

  const liveData: Point[] = data?.series10s ?? [];
  const historyData: Point[] = data?.series10m ?? [];

  const [mode, setMode] = useState<Mode>("live");

  const last10 = useMemo(() => {
    return liveData.reduce(
      (acc, p) => {
        acc.total += p.total;
        acc.allow += p.allow;
        acc.bot += p.bot;
        return acc;
      },
      { total: 0, allow: 0, bot: 0 }
    );
  }, [liveData]);

  const chartData = mode === "live" ? liveData : historyData;

  const description =
    mode === "live" ? "Live (last 10 seconds)" : "History (last 10 minutes)";

  const heightClass = mode === "live" ? "h-[260px]" : "h-[360px]";

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        {/* Toggle buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("live")}
            className={`rounded-md border px-3 py-1 text-sm transition-colors ${
              mode === "live"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            Live (10s)
          </button>
          <button
            onClick={() => setMode("history")}
            className={`rounded-md border px-3 py-1 text-sm transition-colors ${
              mode === "history"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            History (10m)
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {error ? (
          <div className="mb-4 rounded-md border p-3 text-sm text-red-500">
            Stats error: {error}
          </div>
        ) : null}

        {/* KPIs only shown in Live mode (since they are “last 10s”) */}
        {mode === "live" ? (
          <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-md border px-2 py-1">
              Last 10s Total: <b className="text-foreground">{last10.total}</b>
            </span>
            <span className="rounded-md border px-2 py-1">
              Allow: <b className="text-foreground">{last10.allow}</b>
            </span>
            <span className="rounded-md border px-2 py-1">
              Bot: <b className="text-foreground">{last10.bot}</b>
            </span>
          </div>
        ) : null}

        <ChartContainer config={chartConfig} className={`${heightClass} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                interval={mode === "live" ? 0 : 30}
              />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />

              <Line
                type="monotone"
                dataKey="total"
                stroke={chartConfig.total.color}
                strokeWidth={2}
                dot={false}
                name="Total"
                isAnimationActive={mode === "live"}
                animationDuration={200}
              />
              <Line
                type="monotone"
                dataKey="allow"
                stroke={chartConfig.allow.color}
                strokeWidth={2}
                dot={false}
                name="Allow"
                isAnimationActive={mode === "live"}
                animationDuration={200}
              />
              <Line
                type="monotone"
                dataKey="bot"
                stroke={chartConfig.bot.color}
                strokeWidth={2}
                dot={false}
                name="Bot"
                isAnimationActive={mode === "live"}
                animationDuration={200}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
