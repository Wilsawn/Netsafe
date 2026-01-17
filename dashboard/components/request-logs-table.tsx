"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  ip: string
  userAgent: string
  backend: string
  responseTime: number
  status: number
  botScore: number | null
  action: "Allowed" | "Blocked"
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:05.234",
    method: "GET",
    path: "/api/users",
    ip: "192.168.1.45",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    backend: "backend-1",
    responseTime: 45,
    status: 200,
    botScore: null,
    action: "Allowed",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:32:04.891",
    method: "POST",
    path: "/api/login",
    ip: "45.33.32.156",
    userAgent: "python-requests/2.28.1",
    backend: "backend-2",
    responseTime: 320,
    status: 403,
    botScore: 92,
    action: "Blocked",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:32:04.567",
    method: "GET",
    path: "/api/products",
    ip: "10.0.0.123",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    backend: "backend-1",
    responseTime: 78,
    status: 200,
    botScore: null,
    action: "Allowed",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:32:03.234",
    method: "DELETE",
    path: "/api/sessions/abc123",
    ip: "192.168.1.78",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    backend: "backend-3",
    responseTime: 156,
    status: 204,
    botScore: null,
    action: "Allowed",
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:32:02.891",
    method: "GET",
    path: "/api/search?q=shoes",
    ip: "185.220.101.45",
    userAgent: "Scrapy/2.11.0 (+https://scrapy.org)",
    backend: "backend-2",
    responseTime: 512,
    status: 403,
    botScore: 98,
    action: "Blocked",
  },
  {
    id: "6",
    timestamp: "2024-01-15 14:32:01.456",
    method: "PUT",
    path: "/api/users/profile",
    ip: "10.0.0.89",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    backend: "backend-1",
    responseTime: 234,
    status: 200,
    botScore: null,
    action: "Allowed",
  },
  {
    id: "7",
    timestamp: "2024-01-15 14:32:00.123",
    method: "GET",
    path: "/api/inventory",
    ip: "23.129.64.210",
    userAgent: "curl/8.1.2",
    backend: "backend-3",
    responseTime: 89,
    status: 403,
    botScore: 85,
    action: "Blocked",
  },
  {
    id: "8",
    timestamp: "2024-01-15 14:31:59.789",
    method: "POST",
    path: "/api/orders",
    ip: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    backend: "backend-2",
    responseTime: 178,
    status: 201,
    botScore: null,
    action: "Allowed",
  },
  {
    id: "9",
    timestamp: "2024-01-15 14:31:58.456",
    method: "PATCH",
    path: "/api/cart/items",
    ip: "10.0.0.56",
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36",
    backend: "backend-1",
    responseTime: 67,
    status: 200,
    botScore: null,
    action: "Allowed",
  },
  {
    id: "10",
    timestamp: "2024-01-15 14:31:57.123",
    method: "GET",
    path: "/api/recommendations",
    ip: "178.62.43.211",
    userAgent: "Go-http-client/1.1",
    backend: "backend-3",
    responseTime: 445,
    status: 429,
    botScore: 76,
    action: "Blocked",
  },
]

function getMethodBadgeClass(method: string): string {
  switch (method) {
    case "GET":
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
    case "POST":
      return "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30"
    case "PUT":
      return "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
    case "DELETE":
      return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
    case "PATCH":
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getResponseTimeClass(time: number): string {
  if (time < 100) return "text-green-600 dark:text-green-400"
  if (time < 300) return "text-yellow-600 dark:text-yellow-400"
  return "text-red-600 dark:text-red-400"
}

function getStatusBadgeClass(status: number): string {
  if (status >= 200 && status < 300) return "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30"
  if (status >= 400 && status < 500) return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
  if (status >= 500) return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30"
  return "bg-muted text-muted-foreground"
}

function LogRow({ log }: { log: LogEntry }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
          <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
          <TableCell>
            <Badge variant="outline" className={getMethodBadgeClass(log.method)}>
              {log.method}
            </Badge>
          </TableCell>
          <TableCell className="font-mono text-sm max-w-[200px] truncate">{log.path}</TableCell>
          <TableCell className="font-mono text-sm">{log.ip}</TableCell>
          <TableCell className="max-w-[150px] truncate text-sm text-muted-foreground">{log.userAgent}</TableCell>
          <TableCell className="text-sm">{log.backend}</TableCell>
          <TableCell className={`font-mono text-sm ${getResponseTimeClass(log.responseTime)}`}>
            {log.responseTime}ms
          </TableCell>
          <TableCell>
            <Badge variant="outline" className={getStatusBadgeClass(log.status)}>
              {log.status}
            </Badge>
          </TableCell>
          <TableCell>
            {log.botScore !== null ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${log.botScore}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{log.botScore}%</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">-</span>
            )}
          </TableCell>
          <TableCell>
            <Badge
              variant="outline"
              className={
                log.action === "Allowed"
                  ? "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30"
                  : "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
              }
            >
              {log.action}
            </Badge>
          </TableCell>
          <TableCell>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </TableCell>
        </TableRow>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={11} className="py-4">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-foreground">Full User Agent:</span>
                <p className="mt-1 font-mono text-xs text-muted-foreground break-all">{log.userAgent}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="font-medium text-foreground">Request ID:</span>
                  <span className="ml-2 font-mono text-muted-foreground">{log.id}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Full Path:</span>
                  <span className="ml-2 font-mono text-muted-foreground">{log.path}</span>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function RequestLogsTable() {
  const [trafficFilter, setTrafficFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredLogs = mockLogs.filter((log) => {
    if (trafficFilter === "bot" && log.botScore === null) return false
    if (trafficFilter === "legitimate" && log.botScore !== null) return false

    if (statusFilter === "2xx" && (log.status < 200 || log.status >= 300)) return false
    if (statusFilter === "4xx" && (log.status < 400 || log.status >= 500)) return false
    if (statusFilter === "5xx" && log.status < 500) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return log.ip.toLowerCase().includes(query) || log.path.toLowerCase().includes(query)
    }

    return true
  })

  const totalRequests = mockLogs.length
  const totalPages = Math.ceil(filteredLogs.length / 10)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Live Logs</CardTitle>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
            </div>
            <span className="text-sm text-muted-foreground">{totalRequests.toLocaleString()} requests</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={trafficFilter} onValueChange={setTrafficFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Requests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="bot">Bot Traffic</SelectItem>
                <SelectItem value="legitimate">Legitimate Traffic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="2xx">2xx</SelectItem>
                <SelectItem value="4xx">4xx</SelectItem>
                <SelectItem value="5xx">5xx</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search IP or path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[180px]"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[80px]">Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead className="w-[130px]">IP Address</TableHead>
                <TableHead>User Agent</TableHead>
                <TableHead className="w-[100px]">Backend</TableHead>
                <TableHead className="w-[100px]">Response</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[120px]">Bot Score</TableHead>
                <TableHead className="w-[90px]">Action</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <LogRow key={log.id} log={log} />
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {totalRequests} requests
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
