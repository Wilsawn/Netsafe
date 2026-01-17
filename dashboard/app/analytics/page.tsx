import { Sidebar } from "@/components/sidebar"
import { BotDetectionStats } from "@/components/bot-detection-stats"
import { DetectionMethodsChart } from "@/components/detection-methods-chart"
import { TopBotSourcesTable } from "@/components/top-bot-sources"
import { BotTrafficTimeline } from "@/components/bot-traffic-timeline"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bot Detection Analytics</h1>
          <p className="mt-1 text-muted-foreground">Detailed bot detection statistics and insights</p>
        </div>

        <BotDetectionStats />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <DetectionMethodsChart />
          <TopBotSourcesTable />
        </div>

        <div className="mt-8">
          <BotTrafficTimeline />
        </div>
      </main>
    </div>
  )
}
