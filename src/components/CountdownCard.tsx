import { useEffect, useState } from "react";
import { Target, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Goal {
  id: string;
  name: string;
  date: string;
  color: string;
}

interface CountdownCardProps {
  goal: Goal;
  onRemove: (id: string) => void;
}

function getTimeLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export default function CountdownCard({ goal, onRemove }: CountdownCardProps) {
  const [time, setTime] = useState(getTimeLeft(goal.date));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(goal.date)), 1000);
    return () => clearInterval(interval);
  }, [goal.date]);

  const gradients: Record<string, string> = {
    blue: "from-primary to-primary/80",
    orange: "from-accent to-warning",
    green: "from-success to-success/80",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl bg-gradient-to-br ${gradients[goal.color] || gradients.blue} p-5 text-primary-foreground shadow-elevated overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-background/5 rounded-full -translate-y-12 translate-x-12" />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span className="text-sm font-semibold opacity-90">{goal.name}</span>
        </div>
        <button
          onClick={() => onRemove(goal.id)}
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-3">
        {[
          { val: time.days, label: "Days" },
          { val: time.hours, label: "Hrs" },
          { val: time.minutes, label: "Min" },
          { val: time.seconds, label: "Sec" },
        ].map(({ val, label }) => (
          <div key={label} className="text-center">
            <div className="bg-background/15 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[50px]">
              <span className="text-2xl font-display font-bold tabular-nums">
                {String(val).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] mt-1 block opacity-80">{label}</span>
          </div>
        ))}
      </div>
      {time.expired && (
        <div className="mt-3 text-sm font-semibold opacity-90">🎉 Time's up! Good luck!</div>
      )}
    </motion.div>
  );
}
