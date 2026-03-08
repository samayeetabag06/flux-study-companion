import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Flame, Calendar } from "lucide-react";

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  hours: Math.round((Math.random() * 5 + 2) * 10) / 10,
  target: 5,
}));

const weeklyData = [
  { week: "W1", hours: 28 },
  { week: "W2", hours: 34 },
  { week: "W3", hours: 22 },
  { week: "W4", hours: 38 },
];

const subjectData = [
  { name: "DSA", value: 45, color: "hsl(234 89% 60%)" },
  { name: "Web Dev", value: 30, color: "hsl(25 95% 53%)" },
  { name: "Math", value: 25, color: "hsl(152 69% 42%)" },
  { name: "Physics", value: 15, color: "hsl(199 89% 48%)" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-display font-bold text-foreground">
        Analytics
      </motion.h1>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Hours", value: "125h", icon: TrendingUp, gradient: "gradient-primary" },
          { label: "Current Streak", value: "7 days", icon: Flame, gradient: "gradient-accent" },
          { label: "Best Streak", value: "14 days", icon: Flame, gradient: "gradient-success" },
          { label: "Study Days", value: "22/30", icon: Calendar, gradient: "gradient-primary" },
        ].map(({ label, value, icon: Icon, gradient }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-card border border-border p-4 shadow-card"
          >
            <div className={`w-8 h-8 rounded-lg ${gradient} flex items-center justify-center mb-2`}>
              <Icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Daily Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-card border border-border p-5 shadow-card">
        <h3 className="font-display font-semibold text-card-foreground mb-4">Daily Study Hours (30 days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} unit="h" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 12 }} />
            <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="target" stroke="hsl(var(--accent))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-card border border-border p-5 shadow-card">
          <h3 className="font-display font-semibold text-card-foreground mb-4">Weekly Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 12 }} />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl bg-card border border-border p-5 shadow-card">
          <h3 className="font-display font-semibold text-card-foreground mb-4">Subject Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={subjectData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {subjectData.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {subjectData.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                  <span className="text-card-foreground">{s.name}</span>
                  <span className="font-semibold text-muted-foreground ml-auto">{s.value}h</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
