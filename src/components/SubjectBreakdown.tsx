import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BookOpen } from "lucide-react";

const subjects = [
  { name: "DSA", hours: 45, color: "hsl(234 89% 60%)" },
  { name: "Web Dev", hours: 30, color: "hsl(25 95% 53%)" },
  { name: "Math", hours: 25, color: "hsl(152 69% 42%)" },
  { name: "Physics", hours: 15, color: "hsl(199 89% 48%)" },
  { name: "Other", hours: 10, color: "hsl(220 9% 46%)" },
];

export default function SubjectBreakdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-accent-foreground" />
        </div>
        <h3 className="font-display font-semibold text-card-foreground">Subjects</h3>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={subjects}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={3}
              dataKey="hours"
            >
              {subjects.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 flex-1">
          {subjects.map((s) => (
            <div key={s.name} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
              <span className="text-card-foreground flex-1">{s.name}</span>
              <span className="font-semibold text-muted-foreground">{s.hours}h</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
