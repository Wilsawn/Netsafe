import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface BotSource {
  rank: number
  ipAddress: string
  requestCount: number
  status: "blocked" | "monitored"
}

const botSources: BotSource[] = [
  { rank: 1, ipAddress: "192.168.1.45", requestCount: 15420, status: "blocked" },
  { rank: 2, ipAddress: "10.0.0.123", requestCount: 12890, status: "blocked" },
  { rank: 3, ipAddress: "172.16.0.89", requestCount: 9876, status: "monitored" },
  { rank: 4, ipAddress: "192.168.2.201", requestCount: 8654, status: "blocked" },
  { rank: 5, ipAddress: "10.1.1.55", requestCount: 7432, status: "blocked" },
  { rank: 6, ipAddress: "172.20.0.12", requestCount: 6210, status: "monitored" },
  { rank: 7, ipAddress: "192.168.5.78", requestCount: 5890, status: "blocked" },
  { rank: 8, ipAddress: "10.2.3.99", requestCount: 4567, status: "blocked" },
  { rank: 9, ipAddress: "172.18.1.34", requestCount: 3421, status: "monitored" },
  { rank: 10, ipAddress: "192.168.10.156", requestCount: 2198, status: "blocked" },
]

const maxRequests = Math.max(...botSources.map((s) => s.requestCount))

export function TopBotSourcesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Bot Sources</CardTitle>
        <CardDescription>Most active bot IP addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead className="w-24">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {botSources.map((source) => (
              <TableRow key={source.rank}>
                <TableCell className="font-medium">{source.rank}</TableCell>
                <TableCell className="font-mono text-sm">{source.ipAddress}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-destructive"
                        style={{ width: `${(source.requestCount / maxRequests) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{source.requestCount.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={source.status === "blocked" ? "destructive" : "secondary"}>{source.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
