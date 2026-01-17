"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

const trafficData = [
  { day: "Mon", blocked: 18500, allowed: 2100 },
  { day: "Tue", blocked: 21200, allowed: 2450 },
  { day: "Wed", blocked: 19800, allowed: 1980 },
  { day: "Thu", blocked: 24100, allowed: 2890 },
  { day: "Fri", blocked: 22400, allowed: 2650 },
  { day: "Sat", blocked: 16800, allowed: 1540 },
  { day: "Sun", blocked: 15200, allowed: 1320 },
]

const chartConfig = {
  blocked: {
    label: "Blocked",
    color: "hsl(0, 85%, 55%)",
  },
  allowed: {
    label: "Allowed",
    color: "hsl(45, 100%, 50%)",
  },
}

export function BotTrafficTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Traffic - Last 7 Days</CardTitle>
        <CardDescription>Stacked view of blocked vs allowed bot requests</CardDescription>
      </CardHeader>
      <CardContent>
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
              <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="blocked"
                stackId="1"
                stroke="hsl(0, 85%, 55%)"
                fill="url(#blockedGradient)"
                name="Blocked"
              />
              <Area
                type="monotone"
                dataKey="allowed"
                stackId="1"
                stroke="hsl(45, 100%, 50%)"
                fill="url(#allowedGradient)"
                name="Allowed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
