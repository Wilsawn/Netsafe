import { Sidebar } from "@/components/sidebar"
import { RequestLogsTable } from "@/components/request-logs-table"

export default function LogsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Request Logs</h1>
          <p className="mt-1 text-muted-foreground">Real-time request monitoring</p>
        </div>

        <RequestLogsTable />
      </main>
    </div>
  )
}
