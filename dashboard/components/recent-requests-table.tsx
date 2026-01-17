import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RequestData {
  time: string
  ip: string
  path: string
  backend: string
  status: number
  isBot: boolean
}

const recentRequests: RequestData[] = [
  { time: "14:32:05", ip: "192.168.1.45", path: "/api/users", backend: "backend-1", status: 200, isBot: false },
  { time: "14:32:04", ip: "10.0.0.123", path: "/api/products", backend: "backend-2", status: 200, isBot: false },
  { time: "14:32:03", ip: "45.33.32.156", path: "/api/login", backend: "backend-1", status: 403, isBot: true },
  { time: "14:32:02", ip: "192.168.1.78", path: "/api/orders", backend: "backend-3", status: 200, isBot: false },
  { time: "14:32:01", ip: "185.220.101.45", path: "/api/users", backend: "backend-1", status: 403, isBot: true },
  { time: "14:32:00", ip: "10.0.0.89", path: "/api/checkout", backend: "backend-2", status: 201, isBot: false },
  { time: "14:31:59", ip: "192.168.1.102", path: "/api/products", backend: "backend-2", status: 200, isBot: false },
  { time: "14:31:58", ip: "23.129.64.210", path: "/api/search", backend: "backend-3", status: 403, isBot: true },
  { time: "14:31:57", ip: "10.0.0.56", path: "/api/users", backend: "backend-1", status: 200, isBot: false },
  { time: "14:31:56", ip: "192.168.1.34", path: "/api/orders", backend: "backend-3", status: 200, isBot: false },
]

function getStatusBadgeVariant(status: number): "default" | "secondary" | "destructive" | "outline" {
  if (status >= 200 && status < 300) return "default"
  if (status >= 400 && status < 500) return "destructive"
  return "secondary"
}

export function RecentRequestsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Backend</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bot Detected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRequests.map((request, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                <TableCell className="font-mono text-sm">{request.time}</TableCell>
                <TableCell className="font-mono text-sm">{request.ip}</TableCell>
                <TableCell className="font-mono text-sm">{request.path}</TableCell>
                <TableCell>{request.backend}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={request.isBot ? "destructive" : "outline"}
                    className={request.isBot ? "" : "border-green-500 text-green-600 dark:text-green-400"}
                  >
                    {request.isBot ? "Bot" : "Safe"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
