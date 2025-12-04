import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const data = [
  { name: "Mon", attacks: 45, blocked: 42, success: 3 },
  { name: "Tue", attacks: 52, blocked: 48, success: 4 },
  { name: "Wed", attacks: 78, blocked: 71, success: 7 },
  { name: "Thu", attacks: 63, blocked: 60, success: 3 },
  { name: "Fri", attacks: 95, blocked: 89, success: 6 },
  { name: "Sat", attacks: 42, blocked: 40, success: 2 },
  { name: "Sun", attacks: 38, blocked: 37, success: 1 },
];

export function AttackLineChart() {
  return (
    <div className="cyber-card p-6 lg:p-8 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Attacks Over Time
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Total</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Success</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 100%, 62%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199, 100%, 62%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(148, 100%, 57%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(148, 100%, 57%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(217, 19%, 20%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(214, 22%, 13%)",
                border: "1px solid hsl(217, 19%, 20%)",
                borderRadius: "8px",
                boxShadow: "0 0 20px hsl(199, 100%, 62%, 0.2)",
              }}
              itemStyle={{ color: "hsl(210, 40%, 98%)" }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
            />
            <Area
              type="monotone"
              dataKey="attacks"
              stroke="hsl(199, 100%, 62%)"
              strokeWidth={2}
              fill="url(#colorAttacks)"
            />
            <Area
              type="monotone"
              dataKey="blocked"
              stroke="hsl(148, 100%, 57%)"
              strokeWidth={2}
              fill="url(#colorBlocked)"
            />
            <Line
              type="monotone"
              dataKey="success"
              stroke="hsl(0, 100%, 60%)"
              strokeWidth={2}
              dot={{ fill: "hsl(0, 100%, 60%)", strokeWidth: 0, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
