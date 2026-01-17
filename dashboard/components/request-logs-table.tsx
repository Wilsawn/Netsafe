"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLiveStats } from "@/lib/useLiveStats";

type TrafficFilter = "all" | "bot" | "legitimate";
type StatusFilter = "all" | "2xx" | "4xx" | "5xx";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour12: false });
}

// Your system doesn’t have real HTTP status, so we map decision -> status-ish
function decisionToStatus(decision: string): number {
  if (decision === "ALLOW") return 200;
  if (decision === "REROUTE") return 307; // temp redirect-ish
  if (decision === "BLOCK") return 403;
  return 200;
}

function getStatusBadgeClass(status: number): string {
  if (status >= 200 && status < 300) return "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30";
  if (status >= 300 && status < 400) return "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
  if (status >= 400 && status < 500) return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";
  if (status >= 500) return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30";
  return "bg-muted text-muted-foreground";
}

function actionBadge(decision: string) {
  const isAllowed = decision === "ALLOW";
  return (
    <Badge
      variant="outline"
      className={
        isAllowed
          ? "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30"
          : "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
      }
    >
      {isAllowed ? "Allowed" : "Blocked"}
    </Badge>
  );
}

function decisionBadge(decision: string) {
  if (decision === "BLOCK") return <Badge variant="destructive">BLOCK</Badge>;
  if (decision === "REROUTE") return <Badge variant="secondary">REROUTE</Badge>;
  return <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">ALLOW</Badge>;
}

function botScorePct(attackScore: number): number {
  const n = Number.isFinite(attackScore) ? attackScore : 0;
  return Math.max(0, Math.min(100, Math.round(n * 100)));
}

function LogRow({
  log,
  index,
}: {
  log: {
    ts: string;
    attack_score: number;
    decision: string;
    chosen_backend: string | null;
    src_ip?: string | null;
    path?: string | null;
    ua?: string | null;
  };
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const status = decisionToStatus(log.decision);
  const ip = log.src_ip ?? "—";
  const path = log.path ?? "—";
  const ua = log.ua ?? "—";
  const score = Number.isFinite(log.attack_score) ? log.attack_score : 0;
  const scorePct = botScorePct(score);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <TableRow className={`cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
          <TableCell className="font-mono text-xs text-muted-foreground">{formatTime(log.ts)}</TableCell>

          <TableCell className="font-mono text-sm max-w-[240px] truncate">{path}</TableCell>

          <TableCell className="font-mono text-sm">{ip}</TableCell>

          <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">{ua}</TableCell>

          <TableCell className="font-mono text-sm">{log.chosen_backend ?? "—"}</TableCell>

          <TableCell className="font-mono text-sm">{score.toFixed(3)}</TableCell>

          <TableCell>{decisionBadge(log.decision)}</TableCell>

          <TableCell>
            <Badge variant="outline" className={getStatusBadgeClass(status)}>
              {status}
            </Badge>
          </TableCell>

          <TableCell>
            <div className="flex items-center gap-2">
              <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${scorePct}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{scorePct}%</span>
            </div>
          </TableCell>

          <TableCell>{actionBadge(log.decision)}</TableCell>

          <TableCell>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </TableCell>
        </TableRow>
      </CollapsibleTrigger>

      <CollapsibleContent asChild>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={11} className="py-4">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-foreground">Full User Agent:</span>
                <p className="mt-1 font-mono text-xs text-muted-foreground break-all">{ua}</p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div>
                  <span className="font-medium text-foreground">Timestamp:</span>
                  <span className="ml-2 font-mono text-muted-foreground">{log.ts}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Full Path:</span>
                  <span className="ml-2 font-mono text-muted-foreground">{path}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">IP:</span>
                  <span className="ml-2 font-mono text-muted-foreground">{ip}</span>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function RequestLogsTable() {
  const { data, error } = useLiveStats(500);

  const [trafficFilter, setTrafficFilter] = useState<TrafficFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const logs = data?.recent ?? [];
  const totalRequests = data?.recent_count ?? logs.length;

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return logs.filter((log) => {
      const isBot = log.decision !== "ALLOW";
      if (trafficFilter === "bot" && !isBot) return false;
      if (trafficFilter === "legitimate" && isBot) return false;

      const status = decisionToStatus(log.decision);
      if (statusFilter === "2xx" && (status < 200 || status >= 300)) return false;
      if (statusFilter === "4xx" && (status < 400 || status >= 500)) return false;
      if (statusFilter === "5xx" && status < 500) return false;

      if (q) {
        const ip = (log.src_ip ?? "").toLowerCase();
        const path = (log.path ?? "").toLowerCase();
        const ua = (log.ua ?? "").toLowerCase();
        return ip.includes(q) || path.includes(q) || ua.includes(q);
      }

      return true;
    });
  }, [logs, trafficFilter, statusFilter, searchQuery]);

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));

  const pageLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, currentPage]);

  // If filters shrink results, keep page in range
  if (currentPage > totalPages) {
    // safe immediate clamp (no effect loops b/c totalPages stable per render)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setTimeout(() => setCurrentPage(totalPages), 0);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Live Logs</CardTitle>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
            </div>
            <span className="text-sm text-muted-foreground">{totalRequests.toLocaleString()} requests</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={trafficFilter} onValueChange={(v) => { setTrafficFilter(v as TrafficFilter); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Requests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="bot">Bot Traffic</SelectItem>
                <SelectItem value="legitimate">Legitimate Traffic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as StatusFilter); setCurrentPage(1); }}>
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
                placeholder="Search IP, path, UA..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9 w-[220px]"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error ? (
          <div className="mb-4 rounded-md border p-3 text-sm text-red-500">
            Stats error: {error}
          </div>
        ) : null}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">Time</TableHead>
                <TableHead>Path</TableHead>
                <TableHead className="w-[140px]">IP Address</TableHead>
                <TableHead>User Agent</TableHead>
                <TableHead className="w-[90px]">Backend</TableHead>
                <TableHead className="w-[100px]">Score</TableHead>
                <TableHead className="w-[100px]">Decision</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[140px]">Bot Score</TableHead>
                <TableHead className="w-[90px]">Action</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-8 text-center text-muted-foreground">
                    No logs match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                pageLogs.map((log, idx) => (
                  <LogRow key={`${log.ts}-${idx}`} log={log} index={idx} />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {pageLogs.length} of {filteredLogs.length} (from {totalRequests.toLocaleString()} total)
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
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
