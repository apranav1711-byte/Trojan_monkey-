import { Download, Calendar, TrendingUp, Shield, Target, Globe } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { AttackPieChart } from "@/components/charts/AttackPieChart";
import { AttackLineChart } from "@/components/charts/AttackLineChart";
import { FlappyBird } from "@/components/game/FlappyBird";
import { useQuery } from "@tanstack/react-query";
import { getStats, getLogs, getUniqueIPs, getAttackStats } from "@/lib/api";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Reports() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const { data: logsData } = useQuery({
    queryKey: ["logs"],
    queryFn: () => getLogs(1000),
  });

  const { data: uniqueIPs } = useQuery({
    queryKey: ["uniqueIPs"],
    queryFn: getUniqueIPs,
  });

  const { data: attackStats } = useQuery({
    queryKey: ["attackStats"],
    queryFn: getAttackStats,
  });

  const topIPs = useMemo(() => {
    if (!logsData?.items) return [];
    const ipCounts: Record<string, number> = {};
    logsData.items.forEach((event) => {
      if (event.isAttack) {
        ipCounts[event.srcIP] = (ipCounts[event.srcIP] || 0) + 1;
      }
    });
    return Object.entries(ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([ip, attacks]) => ({ ip, attacks, country: "Unknown" }));
  }, [logsData]);

  const topPayloads = useMemo(() => {
    if (!logsData?.items) return [];
    const payloadCounts: Record<string, { count: number; type: string }> = {};
    logsData.items.forEach((event) => {
      if (event.isAttack && event.url) {
        // Extract potential payload from URL
        const urlParts = event.url.split("?");
        if (urlParts.length > 1) {
          const query = urlParts[1];
          if (query.length > 0 && query.length < 100) {
            // Only track reasonable length payloads
            if (!payloadCounts[query]) {
              payloadCounts[query] = { count: 0, type: event.attackType };
            }
            payloadCounts[query].count++;
          }
        }
      }
    });
    return Object.entries(payloadCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([payload, data]) => ({ payload, count: data.count, type: data.type }));
  }, [logsData]);

  const blockedAttacks = stats ? stats.attackCount - stats.successfulCount : 0;
  const successRate = stats && stats.attackCount > 0
    ? ((stats.successfulCount / stats.attackCount) * 100).toFixed(1)
    : "0";

  const summaryStats = [
    { label: "Total Attacks", value: stats?.attackCount?.toLocaleString() || "0", icon: Target },
    { label: "Blocked", value: blockedAttacks.toLocaleString(), icon: Shield },
    { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp },
    { label: "Unique IPs", value: uniqueIPs?.toLocaleString() || "0", icon: Globe },
  ];
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
            <AttackLineChart timeBins={attackStats?.timeBins} />
            <AttackPieChart attacksByType={attackStats?.attacksByType} />
          </div>

          {/* Tables */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top IPs */}
            <div className="cyber-card p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Top Attacking IPs
              </h3>
              <div className="space-y-4">
                {topIPs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No attack data available</p>
                ) : (
                  topIPs.map((item, index) => (
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
                  ))
                )}
              </div>
            </div>

            {/* Top Payloads */}
            <div className="cyber-card p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Top Attack Payloads
              </h3>
              <div className="space-y-4">
                {topPayloads.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No payload data available</p>
                ) : (
                  topPayloads.map((item, index) => (
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
                  ))
                )}
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
