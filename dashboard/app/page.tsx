import { Sidebar } from "@/components/sidebar"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { TrafficChart } from "@/components/traffic-chart"
import { RecentRequestsTable } from "@/components/recent-requests-table"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="mt-1 text-muted-foreground">Real-time metrics and bot detection</p>
        </div>

        <DashboardMetrics />

        <div className="mt-8">
          <TrafficChart />
        </div>

        <div className="mt-8">
          <RecentRequestsTable />
        </div>
      </main>
    </div>
  )
}
