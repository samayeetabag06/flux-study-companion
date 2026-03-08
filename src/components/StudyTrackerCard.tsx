import { Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  todayHours: number;
  weekHours: number;
  monthTarget: number;
  monthHours: number;
}

export default function StudyTrackerCard({ todayHours, weekHours, monthTarget, monthHours }: Props) {
  const monthPct = Math.min((monthHours / monthTarget) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-card border border-border p-5 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center">
          <Clock className="w-4 h-4 text-success-foreground" />
        </div>
        <h3 className="font-display font-semibold text-card-foreground">Study Hours</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-xl bg-secondary">
          <span className="text-2xl font-display font-bold text-foreground">{todayHours}</span>
          <p className="text-[11px] text-muted-foreground mt-0.5">Today</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-secondary">
          <span className="text-2xl font-display font-bold text-foreground">{weekHours}</span>
          <p className="text-[11px] text-muted-foreground mt-0.5">This Week</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-secondary">
          <span className="text-2xl font-display font-bold text-foreground">{monthHours}</span>
          <p className="text-[11px] text-muted-foreground mt-0.5">This Month</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Monthly Target</span>
          <span className="font-semibold text-foreground">{monthHours}/{monthTarget}h</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${monthPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full gradient-success"
          />
        </div>
      </div>
    </motion.div>
  );
}
