import { Card, CardContent } from "@/components/ui/card"
import { ShieldAlert, Ban, CheckCircle, Target } from "lucide-react"

const stats = [
  {
    label: "Total Bots Detected",
    value: "158,432",
    icon: ShieldAlert,
  },
  {
    label: "Blocked Requests",
    value: "142,891",
    icon: Ban,
  },
  {
    label: "Allowed Requests",
    value: "15,541",
    icon: CheckCircle,
  },
  {
    label: "Detection Rate",
    value: "98.7%",
    icon: Target,
  },
]

export function BotDetectionStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
