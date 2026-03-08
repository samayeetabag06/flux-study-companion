import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, BookOpen, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "focus" | "shortBreak" | "longBreak";

const MODE_LABELS: Record<Mode, string> = {
  focus: "Focus Time",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export default function PomodoroPage() {
  const [durations, setDurations] = useState<Record<Mode, number>>({
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  });
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(durations.focus);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [editFocus, setEditFocus] = useState("25");
  const [editShort, setEditShort] = useState("5");
  const [editLong, setEditLong] = useState("15");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback((m: Mode, durs?: Record<Mode, number>) => {
    const d = durs || durations;
    setMode(m);
    setTimeLeft(d[m]);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [durations]);

  const saveSettings = () => {
    const f = Math.max(1, parseInt(editFocus) || 25);
    const s = Math.max(1, parseInt(editShort) || 5);
    const l = Math.max(1, parseInt(editLong) || 15);
    const newDurations = { focus: f * 60, shortBreak: s * 60, longBreak: l * 60 };
    setDurations(newDurations);
    reset(mode, newDurations);
    setShowSettings(false);
  };

  const openSettings = () => {
    setEditFocus(String(durations.focus / 60));
    setEditShort(String(durations.shortBreak / 60));
    setEditLong(String(durations.longBreak / 60));
    setShowSettings(true);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setRunning(false);
            if (mode === "focus") setSessions((s) => s + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const pct = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <h1 className="text-2xl font-display font-bold text-foreground">Pomodoro Timer</h1>
        <button onClick={openSettings} className="text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card border border-border p-5 shadow-card w-full max-w-sm space-y-3"
        >
          <h3 className="font-display font-semibold text-card-foreground text-sm">Timer Settings (minutes)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Focus</Label>
              <Input type="number" value={editFocus} onChange={(e) => setEditFocus(e.target.value)} min={1} max={120} />
            </div>
            <div>
              <Label className="text-xs">Short Break</Label>
              <Input type="number" value={editShort} onChange={(e) => setEditShort(e.target.value)} min={1} max={30} />
            </div>
            <div>
              <Label className="text-xs">Long Break</Label>
              <Input type="number" value={editLong} onChange={(e) => setEditLong(e.target.value)} min={1} max={60} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveSettings} size="sm" className="gradient-primary text-primary-foreground gap-1">
              <Check className="w-4 h-4" /> Save
            </Button>
            <Button onClick={() => setShowSettings(false)} size="sm" variant="outline">Cancel</Button>
          </div>
        </motion.div>
      )}

      {/* Mode Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1">
        {(["focus", "shortBreak", "longBreak"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => reset(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <svg width="280" height="280" className="-rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
          <circle
            cx="140" cy="140" r="120"
            fill="none"
            stroke={mode === "focus" ? "hsl(var(--primary))" : "hsl(var(--success))"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-display font-bold tabular-nums text-foreground">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {mode === "focus" ? <BookOpen className="inline w-4 h-4 mr-1" /> : <Coffee className="inline w-4 h-4 mr-1" />}
            {MODE_LABELS[mode]}
          </span>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={() => setRunning(!running)}
          size="lg"
          className="gradient-primary text-primary-foreground gap-2 px-8"
        >
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {running ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" size="lg" onClick={() => reset(mode)}>
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Sessions completed: <span className="font-semibold text-foreground">{sessions}</span>
        </p>
      </div>
    </div>
  );
}
