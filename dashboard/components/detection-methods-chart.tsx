"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface DetectionMethod {
  name: string
  value: number
  color: string
}

const detectionData: DetectionMethod[] = [
  { name: "ML Model", value: 45, color: "hsl(210, 100%, 50%)" },
  { name: "Rate Limiting", value: 28, color: "hsl(150, 80%, 45%)" },
  { name: "User Agent", value: 18, color: "hsl(45, 100%, 50%)" },
  { name: "Behavior Analysis", value: 9, color: "hsl(280, 80%, 55%)" },
]

const chartConfig = {
  mlModel: {
    label: "ML Model",
    color: "hsl(210, 100%, 50%)",
  },
  rateLimiting: {
    label: "Rate Limiting",
    color: "hsl(150, 80%, 45%)",
  },
  userAgent: {
    label: "User Agent",
    color: "hsl(45, 100%, 50%)",
  },
  behaviorAnalysis: {
    label: "Behavior Analysis",
    color: "hsl(280, 80%, 55%)",
  },
}

export function DetectionMethodsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Methods</CardTitle>
        <CardDescription>Breakdown by detection technique</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={detectionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {detectionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
