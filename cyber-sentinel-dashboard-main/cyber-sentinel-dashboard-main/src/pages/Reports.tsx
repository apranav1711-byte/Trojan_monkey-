import { Download, Calendar, TrendingUp, Shield, Target, Globe } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { AttackPieChart } from "@/components/charts/AttackPieChart";
import { AttackLineChart } from "@/components/charts/AttackLineChart";
import { FlappyBird } from "@/components/game/FlappyBird";

const topIPs = [
  { ip: "192.168.1.105", attacks: 47, country: "US" },
  { ip: "10.0.0.234", attacks: 32, country: "CN" },
  { ip: "172.16.0.89", attacks: 28, country: "RU" },
  { ip: "192.168.2.45", attacks: 21, country: "DE" },
  { ip: "10.0.1.167", attacks: 18, country: "BR" },
];

const topPayloads = [
  { payload: "' OR '1'='1'--", count: 156, type: "SQL Injection" },
  { payload: "<script>alert(1)</script>", count: 89, type: "XSS" },
  { payload: "../../../etc/passwd", count: 67, type: "Path Traversal" },
  { payload: "; ls -la", count: 45, type: "Command Injection" },
  { payload: "{{7*7}}", count: 23, type: "SSTI" },
];

const summaryStats = [
  { label: "Total Attacks", value: "1,247", change: "+12%", icon: Target },
  { label: "Blocked", value: "1,224", change: "+15%", icon: Shield },
  { label: "Success Rate", value: "1.8%", change: "-2.3%", icon: TrendingUp },
  { label: "Unique IPs", value: "342", change: "+8%", icon: Globe },
];

export default function Reports() {
  return (
    <PageLayout>
      <div className="min-h-screen px-6 lg:px-10 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 animate-fade-up">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Security Reports
              </h1>
              <p className="text-muted-foreground">
                Weekly analysis summary and insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg border border-border/50">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Mar 8 - Mar 15, 2024</span>
              </div>
              <Button variant="hero" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 stagger-children">
            {summaryStats.map((stat, index) => (
              <div key={index} className="cyber-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-secondary' : 'text-destructive'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            <AttackLineChart />
            <AttackPieChart />
          </div>

          {/* Tables */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top IPs */}
            <div className="cyber-card p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Top Attacking IPs
              </h3>
              <div className="space-y-4">
                {topIPs.map((item, index) => (
                  <div
                    key={item.ip}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-mono text-foreground">{item.ip}</p>
                        <p className="text-xs text-muted-foreground">{item.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{item.attacks}</p>
                      <p className="text-xs text-muted-foreground">attacks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Payloads */}
            <div className="cyber-card p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Top Attack Payloads
              </h3>
              <div className="space-y-4">
                {topPayloads.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-sm font-bold text-destructive">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-sm text-foreground truncate">
                          {item.payload}
                        </p>
                        <p className="text-xs text-primary">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-semibold text-foreground">{item.count}</p>
                      <p className="text-xs text-muted-foreground">occurrences</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-10 cyber-card p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Export Options
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export as PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export as CSV
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export as JSON
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FlappyBird />
    </PageLayout>
  );
}
