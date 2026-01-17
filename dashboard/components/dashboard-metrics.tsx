import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Activity, Shield, Zap } from "lucide-react"

const metrics = [
  {
    label: "Total Requests",
    value: "1,284,392",
    icon: TrendingUp,
  },
  {
    label: "Requests/Second",
    value: "2,847",
    icon: Activity,
  },
  {
    label: "Bot Detection Rate",
    value: "12.4%",
    icon: Shield,
  },
  {
    label: "Avg Response Time",
    value: "42ms",
    icon: Zap,
  },
]

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <metric.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
