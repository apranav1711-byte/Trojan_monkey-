import { Activity, AlertTriangle, Shield, Skull, TrendingUp } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { AttackPieChart } from "@/components/charts/AttackPieChart";
import { AttackLineChart } from "@/components/charts/AttackLineChart";
import { FlappyBird } from "@/components/game/FlappyBird";

export default function Dashboard() {
  return (
    <PageLayout>
      <div className="min-h-screen px-6 lg:px-10 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-up">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Security Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring and analysis of HTTP attack patterns
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-10 stagger-children">
            <StatCard
              title="Total Requests Analyzed"
              value={128459}
              icon={Activity}
              trend={{ value: 12.5, isPositive: true }}
              variant="default"
            />
            <StatCard
              title="Attacks Detected"
              value={1247}
              icon={AlertTriangle}
              trend={{ value: 8.3, isPositive: false }}
              variant="primary"
            />
            <StatCard
              title="Successful Intrusions"
              value={23}
              icon={Skull}
              trend={{ value: 15.2, isPositive: false }}
              variant="destructive"
            />
            <StatCard
              title="Blocked Attacks"
              value={1224}
              icon={Shield}
              trend={{ value: 5.7, isPositive: true }}
              variant="secondary"
            />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
            <div className="lg:col-span-2">
              <AttackLineChart />
            </div>
            <div>
              <AttackPieChart />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <AlertsList />
            
            {/* Quick Actions */}
            <div className="cyber-card p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionCard
                  icon={TrendingUp}
                  title="Generate Report"
                  description="Export weekly analysis"
                  href="/reports"
                />
                <QuickActionCard
                  icon={AlertTriangle}
                  title="View All Logs"
                  description="Browse attack history"
                  href="/logs"
                />
                <QuickActionCard
                  icon={Shield}
                  title="Upload Logs"
                  description="Analyze new data"
                  href="/upload"
                />
                <QuickActionCard
                  icon={Activity}
                  title="Attack Explorer"
                  description="Deep dive analysis"
                  href="/attack-detail"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Game */}
      <FlappyBird />
    </PageLayout>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

function QuickActionCard({ icon: Icon, title, description, href }: QuickActionCardProps) {
  return (
    <a
      href={href}
      className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group cursor-pointer"
    >
      <Icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
      <h4 className="font-medium text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </a>
  );
}
