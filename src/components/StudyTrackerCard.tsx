import { useState } from "react";
import { Clock, Pencil, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface Props {
  todayHours: number;
  weekHours: number;
  monthTarget: number;
  monthHours: number;
  onUpdate: (field: "todayHours" | "weekHours" | "monthHours" | "monthTarget", value: number) => void;
}

export default function StudyTrackerCard({ todayHours, weekHours, monthTarget, monthHours, onUpdate }: Props) {
  const monthPct = Math.min((monthHours / monthTarget) * 100, 100);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (field: string, currentValue: number) => {
    setEditing(field);
    setEditValue(String(currentValue));
  };

  const confirmEdit = (field: "todayHours" | "weekHours" | "monthHours" | "monthTarget") => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) onUpdate(field, val);
    setEditing(null);
  };

  const statItems = [
    { key: "todayHours" as const, value: todayHours, label: "Today" },
    { key: "weekHours" as const, value: weekHours, label: "This Week" },
    { key: "monthHours" as const, value: monthHours, label: "This Month" },
  ];

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
        {statItems.map(({ key, value, label }) => (
          <div key={key} className="text-center p-3 rounded-xl bg-secondary group relative">
            {editing === key ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit(key)}
                  className="h-8 text-center text-sm font-bold"
                  autoFocus
                  min={0}
                  step={0.5}
                />
                <button onClick={() => confirmEdit(key)} className="text-success shrink-0">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-2xl font-display font-bold text-foreground">{value}</span>
                <button
                  onClick={() => startEdit(key, value)}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </>
            )}
            <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Monthly Target</span>
          {editing === "monthTarget" ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmEdit("monthTarget")}
                className="h-5 w-16 text-xs text-right"
                autoFocus
                min={1}
              />
              <button onClick={() => confirmEdit("monthTarget")} className="text-success">
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => startEdit("monthTarget", monthTarget)}
              className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {monthHours}/{monthTarget}h
              <Pencil className="w-3 h-3 opacity-50" />
            </button>
          )}
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
