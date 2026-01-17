"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Zap, Users, Scale, Clock } from "lucide-react"

type BackendStatus = "healthy" | "degraded" | "down"

interface Backend {
  id: string
  name: string
  url: string
  status: BackendStatus
  responseTime: number
  activeConnections: number
  loadWeight: number
  lastHealthCheck: Date
}

const backends: Backend[] = [
  {
    id: "1",
    name: "Backend Server 1",
    url: "https://api-1.safenet.io:8080",
    status: "healthy",
    responseTime: 45,
    activeConnections: 156,
    loadWeight: 35,
    lastHealthCheck: new Date(Date.now() - 30000),
  },
  {
    id: "2",
    name: "Backend Server 2",
    url: "https://api-2.safenet.io:8080",
    status: "degraded",
    responseTime: 230,
    activeConnections: 89,
    loadWeight: 25,
    lastHealthCheck: new Date(Date.now() - 45000),
  },
  {
    id: "3",
    name: "Backend Server 3",
    url: "https://api-3.safenet.io:8080",
    status: "down",
    responseTime: 0,
    activeConnections: 0,
    loadWeight: 40,
    lastHealthCheck: new Date(Date.now() - 120000),
  },
]

function getStatusStyles(status: BackendStatus) {
  switch (status) {
    case "healthy":
      return {
        dotClass: "bg-emerald-500",
        badgeClass: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20",
        label: "Healthy",
      }
    case "degraded":
      return {
        dotClass: "bg-amber-500",
        badgeClass: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20",
        label: "Degraded",
      }
    case "down":
      return {
        dotClass: "bg-red-500",
        badgeClass: "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20",
        label: "Down",
      }
  }
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function BackendStatusCards() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {backends.map((backend) => {
        const statusStyles = getStatusStyles(backend.status)
        return (
          <Card key={backend.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Server className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">{backend.name}</CardTitle>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{backend.url}</p>
                  </div>
                </div>
                <Badge variant="outline" className={statusStyles.badgeClass}>
                  <span className={`mr-1.5 h-2 w-2 rounded-full ${statusStyles.dotClass}`} />
                  {statusStyles.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Response Time</p>
                    <p className="text-sm font-medium">
                      {backend.status === "down" ? "N/A" : `${backend.responseTime}ms`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Connections</p>
                    <p className="text-sm font-medium">{backend.activeConnections}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Load Weight</p>
                    <p className="text-sm font-medium">{backend.loadWeight}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Check</p>
                    <p className="text-sm font-medium">{formatRelativeTime(backend.lastHealthCheck)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
