import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BarChart3 } from "lucide-react";

const data = [
  { day: "Mon", hours: 4.5, target: 5 },
  { day: "Tue", hours: 6, target: 5 },
  { day: "Wed", hours: 3, target: 5 },
  { day: "Thu", hours: 5.5, target: 5 },
  { day: "Fri", hours: 7, target: 5 },
  { day: "Sat", hours: 2, target: 5 },
  { day: "Sun", hours: 4, target: 5 },
];

export default function WeeklyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="font-display font-semibold text-card-foreground">Weekly Progress</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            unit="h"
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: 13,
            }}
          />
          <ReferenceLine
            y={5}
            stroke="hsl(var(--accent))"
            strokeDasharray="4 4"
            label={{ value: "Target", fill: "hsl(var(--accent))", fontSize: 11 }}
          />
          <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
