import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const studyData: Record<string, { hours: number; type: "study" | "off" | "revision" }> = {
  "2026-03-01": { hours: 4, type: "study" },
  "2026-03-02": { hours: 5, type: "study" },
  "2026-03-03": { hours: 0, type: "off" },
  "2026-03-04": { hours: 6, type: "study" },
  "2026-03-05": { hours: 3, type: "revision" },
  "2026-03-06": { hours: 5, type: "study" },
  "2026-03-07": { hours: 4, type: "study" },
  "2026-03-08": { hours: 7, type: "study" },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const getKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-display font-bold text-foreground"
      >
        Study Calendar
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-6 shadow-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={prev}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-display font-semibold text-lg text-card-foreground">
            {MONTHS[month]} {year}
          </h2>
          <Button variant="ghost" size="icon" onClick={next}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = getKey(day);
            const entry = studyData[key];
            const bgClass = entry
              ? entry.type === "study"
                ? "bg-success/20 border-success/40 text-foreground"
                : entry.type === "off"
                ? "bg-destructive/15 border-destructive/30 text-foreground"
                : "bg-info/20 border-info/40 text-foreground"
              : "bg-secondary/50 text-foreground";

            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border text-sm transition-colors hover:shadow-card cursor-pointer ${bgClass}`}
              >
                <span className="font-medium">{day}</span>
                {entry && entry.hours > 0 && (
                  <span className="text-[10px] text-muted-foreground">{entry.hours}h</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 justify-center">
          {[
            { label: "Study", cls: "bg-success/30" },
            { label: "Off Day", cls: "bg-destructive/20" },
            { label: "Revision", cls: "bg-info/30" },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className={`w-3 h-3 rounded ${cls}`} />
              {label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
