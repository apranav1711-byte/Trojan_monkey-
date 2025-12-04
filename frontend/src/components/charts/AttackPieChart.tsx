import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const colorMap: Record<string, string> = {
  "SQL Injection": "hsl(0, 100%, 60%)",
  "XSS": "hsl(38, 92%, 50%)",
  "Path Traversal": "hsl(199, 100%, 62%)",
  "Directory Traversal": "hsl(199, 100%, 62%)",
  "Command Injection": "hsl(148, 100%, 57%)",
  "SSRF": "hsl(270, 100%, 70%)",
  "NONE": "hsl(215, 20%, 65%)",
};

const defaultColors = [
  "hsl(0, 100%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(199, 100%, 62%)",
  "hsl(148, 100%, 57%)",
  "hsl(270, 100%, 70%)",
  "hsl(215, 20%, 65%)",
];

interface AttackPieChartProps {
  attacksByType?: Record<string, number>;
}

export function AttackPieChart({ attacksByType = {} }: AttackPieChartProps) {
  const data = Object.entries(attacksByType)
    .filter(([_, value]) => value > 0)
    .map(([name, value], index) => ({
      name,
      value,
      color: colorMap[name] || defaultColors[index % defaultColors.length],
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="cyber-card p-6 lg:p-8 h-full">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Attack Types Distribution
        </h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No attack data available
        </div>
      </div>
    );
  }
  return (
    <div className="cyber-card p-6 lg:p-8 h-full">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Attack Types Distribution
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="transition-all duration-300 hover:opacity-80"
                  style={{ filter: "drop-shadow(0 0 8px " + entry.color + ")" }}
                />
              ))}
            </Pie>
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
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-muted-foreground text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
