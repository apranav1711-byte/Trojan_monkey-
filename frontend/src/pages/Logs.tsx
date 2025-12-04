import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, Eye, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FlappyBird } from "@/components/game/FlappyBird";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLogs, HttpEvent } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface LogEntry {
  id: string;
  timestamp: string;
  ip: string;
  url: string;
  attackType: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  status: "attempt" | "success";
  responseCode: number;
  srcIP: string;
  destIP: string;
  method: string;
}

// Convert backend HttpEvent to frontend LogEntry
const convertToLogEntry = (event: HttpEvent, index: number): LogEntry => {
  const severityToRisk: Record<string, "critical" | "high" | "medium" | "low"> = {
    CRITICAL: "critical",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
  };

  return {
    id: event._id || `log-${index}`,
    timestamp: new Date(event.timestamp).toLocaleString(),
    ip: event.srcIP,
    srcIP: event.srcIP,
    destIP: event.destIP,
    method: event.method,
    url: event.url,
    attackType: event.attackType || "NONE",
    riskLevel: severityToRisk[event.severity] || "low",
    status: event.isSuccessful ? "success" : "attempt",
    responseCode: event.statusCode,
  };
};

// Mock logs for development/testing (not used when real data is available)
const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-03-15 14:32:18",
    ip: "192.168.1.105",
    srcIP: "192.168.1.105",
    destIP: "10.0.0.1",
    method: "GET",
    url: "/api/users?id=1' OR '1'='1",
    attackType: "SQL Injection",
    riskLevel: "critical",
    status: "attempt",
    responseCode: 403,
  },
  {
    id: "2",
    timestamp: "2024-03-15 14:28:45",
    ip: "10.0.0.234",
    srcIP: "10.0.0.234",
    destIP: "10.0.0.1",
    method: "GET",
    url: "/search?q=<script>alert('xss')</script>",
    attackType: "XSS",
    riskLevel: "high",
    status: "attempt",
    responseCode: 400,
  },
  {
    id: "3",
    timestamp: "2024-03-15 14:25:12",
    ip: "172.16.0.89",
    srcIP: "172.16.0.89",
    destIP: "10.0.0.1",
    method: "GET",
    url: "/files/../../../etc/passwd",
    attackType: "Path Traversal",
    riskLevel: "critical",
    status: "success",
    responseCode: 200,
  },
  {
    id: "4",
    timestamp: "2024-03-15 14:22:33",
    ip: "192.168.2.45",
    srcIP: "192.168.2.45",
    destIP: "10.0.0.1",
    method: "GET",
    url: "/exec?cmd=ls+-la",
    attackType: "Command Injection",
    riskLevel: "critical",
    status: "attempt",
    responseCode: 403,
  },
  {
    id: "5",
    timestamp: "2024-03-15 14:18:09",
    ip: "10.0.1.167",
    srcIP: "10.0.1.167",
    destIP: "10.0.0.1",
    method: "GET",
    url: "/api/admin?auth=bypass",
    attackType: "Auth Bypass",
    riskLevel: "high",
    status: "attempt",
    responseCode: 401,
  },
  {
    id: "6",
    timestamp: "2024-03-15 14:15:44",
    ip: "192.168.3.22",
    srcIP: "192.168.3.22",
    destIP: "10.0.0.1",
    method: "POST",
    url: "/login?user=admin&pass=' OR 1=1--",
    attackType: "SQL Injection",
    riskLevel: "critical",
    status: "attempt",
    responseCode: 403,
  },
  {
    id: "7",
    timestamp: "2024-03-15 14:12:21",
    ip: "172.16.1.98",
    srcIP: "172.16.1.98",
    destIP: "10.0.0.1",
    method: "POST",
    url: "/upload?file=shell.php",
    attackType: "File Upload",
    riskLevel: "high",
    status: "success",
    responseCode: 200,
  },
  {
    id: "8",
    timestamp: "2024-03-15 14:08:55",
    ip: "10.0.2.133",
    srcIP: "10.0.2.133",
    destIP: "10.0.0.1",
    method: "GET",
    url: "/api/data?callback=malicious",
    attackType: "JSONP Injection",
    riskLevel: "medium",
    status: "attempt",
    responseCode: 400,
  },
];

const riskColors = {
  critical: "bg-destructive/20 text-destructive border-destructive/50",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  medium: "bg-warning/20 text-warning border-warning/50",
  low: "bg-secondary/20 text-secondary border-secondary/50",
};

const statusColors = {
  attempt: "bg-primary/20 text-primary border-primary/50",
  success: "bg-destructive/20 text-destructive border-destructive/50",
};

const filters = ["All", "SQL Injection", "XSS", "Path Traversal", "Command Injection"];

export default function Logs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  const { data: logsData, isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: () => getLogs(500),
    refetchInterval: 30000,
  });

  const logs = useMemo(() => {
    if (!logsData?.items) return [];
    return logsData.items.map(convertToLogEntry);
  }, [logsData]);

  // Get unique attack types for filter
  const attackTypes = useMemo(() => {
    const types = new Set(logs.map((log) => log.attackType).filter((t) => t && t !== "NONE"));
    return ["All", ...Array.from(types).sort()];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery) ||
        log.attackType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === "All" || log.attackType === selectedFilter;
      const matchesRisk = !selectedRisk || log.riskLevel === selectedRisk;
      return matchesSearch && matchesFilter && matchesRisk;
    });
  }, [logs, searchQuery, selectedFilter, selectedRisk]);

  return (
    <PageLayout>
      <div className="min-h-screen px-6 lg:px-10 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-up">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Attack Logs
            </h1>
            <p className="text-muted-foreground">
              Browse and analyze detected attack attempts and intrusions
            </p>
          </div>

          {/* Filters */}
          <div className="cyber-card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by IP, URL, or attack type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/30 border-border/50 focus:border-primary"
                />
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap items-center gap-2">
                {attackTypes.slice(0, 10).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      selectedFilter === filter
                        ? "bg-primary text-primary-foreground shadow-glow-sm"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Risk filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedRisk || ""}
                  onChange={(e) => setSelectedRisk(e.target.value || null)}
                  className="bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">All Risks</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="cyber-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Timestamp
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      IP Address
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      URL
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Attack Type
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Risk Level
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Response
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td colSpan={8} className="px-6 py-5">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">
                        No logs found. Upload a PCAP file to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => (
                    <tr
                      key={log.id}
                      className="table-row-cyber border-b border-border/30 last:border-0"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-5 text-sm text-muted-foreground font-mono">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-5 text-sm text-foreground font-mono">
                        {log.ip}
                      </td>
                      <td className="px-6 py-5 text-sm text-foreground font-mono max-w-[250px] truncate">
                        {log.url}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-primary">
                          {log.attackType}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", riskColors[log.riskLevel])}
                        >
                          {log.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", statusColors[log.status])}
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "text-sm font-mono",
                            log.responseCode >= 400
                              ? "text-secondary"
                              : "text-destructive"
                          )}
                        >
                          {log.responseCode}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <Link to={`/attack-detail?id=${log.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {logs.length} entries
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary/10">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FlappyBird />
    </PageLayout>
  );
}
