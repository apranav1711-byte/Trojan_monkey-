import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "SQL Injection", value: 35, color: "hsl(0, 100%, 60%)" },
  { name: "XSS", value: 28, color: "hsl(38, 92%, 50%)" },
  { name: "Path Traversal", value: 18, color: "hsl(199, 100%, 62%)" },
  { name: "Command Injection", value: 12, color: "hsl(148, 100%, 57%)" },
  { name: "Other", value: 7, color: "hsl(270, 100%, 70%)" },
];

export function AttackPieChart() {
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
