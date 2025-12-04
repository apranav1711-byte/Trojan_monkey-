import { AlertTriangle, Shield, Skull, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    title: "SQL Injection Detected",
    description: "Malicious payload in /api/users endpoint",
    severity: "critical",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    title: "XSS Attempt Blocked",
    description: "Script injection in search parameter",
    severity: "high",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    title: "Path Traversal Attempt",
    description: "Directory traversal in file upload",
    severity: "high",
    timestamp: "32 min ago",
  },
  {
    id: "4",
    title: "Suspicious User Agent",
    description: "Known scanner detected from 192.168.1.45",
    severity: "medium",
    timestamp: "1 hour ago",
  },
  {
    id: "5",
    title: "Rate Limit Exceeded",
    description: "IP 10.0.0.123 exceeded request threshold",
    severity: "low",
    timestamp: "2 hours ago",
  },
];

const severityConfig = {
  critical: {
    icon: Skull,
    className: "severity-critical",
    dotColor: "bg-destructive",
  },
  high: {
    icon: AlertTriangle,
    className: "severity-high",
    dotColor: "bg-orange-500",
  },
  medium: {
    icon: Shield,
    className: "severity-medium",
    dotColor: "bg-warning",
  },
  low: {
    icon: Info,
    className: "severity-low",
    dotColor: "bg-secondary",
  },
};

export function AlertsList() {
  return (
    <div className="cyber-card p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        <span className="text-sm text-primary cursor-pointer hover:underline">
          View all
        </span>
      </div>
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 hover:translate-x-1 cursor-pointer",
                config.className
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                <span
                  className={cn(
                    "absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse",
                    config.dotColor
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground truncate">
                    {alert.title}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
