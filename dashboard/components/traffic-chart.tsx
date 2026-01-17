"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

const trafficData = [
  { time: "00:00", legitimate: 1200, bot: 150 },
  { time: "02:00", legitimate: 800, bot: 90 },
  { time: "04:00", legitimate: 600, bot: 70 },
  { time: "06:00", legitimate: 900, bot: 110 },
  { time: "08:00", legitimate: 1800, bot: 200 },
  { time: "10:00", legitimate: 2400, bot: 350 },
  { time: "12:00", legitimate: 2800, bot: 420 },
  { time: "14:00", legitimate: 2600, bot: 380 },
  { time: "16:00", legitimate: 2900, bot: 450 },
  { time: "18:00", legitimate: 2200, bot: 280 },
  { time: "20:00", legitimate: 1600, bot: 180 },
  { time: "22:00", legitimate: 1400, bot: 160 },
]

const chartConfig = {
  legitimate: {
    label: "Legitimate Traffic",
    color: "hsl(210, 100%, 50%)",
  },
  bot: {
    label: "Bot Traffic",
    color: "hsl(0, 85%, 55%)",
  },
}

export function TrafficChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
        <CardDescription>Last 24 Hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="legitimate"
                stroke={chartConfig.legitimate.color}
                strokeWidth={2}
                dot={false}
                name="Legitimate Traffic"
              />
              <Line
                type="monotone"
                dataKey="bot"
                stroke={chartConfig.bot.color}
                strokeWidth={2}
                dot={false}
                name="Bot Traffic"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
