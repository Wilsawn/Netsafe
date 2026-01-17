import { Sidebar } from "@/components/sidebar"
import { BackendStatusCards } from "@/components/backend-status-cards"

export default function BackendsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Backend Servers</h1>
          <p className="mt-1 text-muted-foreground">Monitor and manage your backend infrastructure</p>
        </div>

        <BackendStatusCards />
      </main>
    </div>
  )
}
