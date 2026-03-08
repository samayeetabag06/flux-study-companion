import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, X, Clock, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
  notes: string;
}

interface Props {
  onSessionSave: (hours: number) => void;
}

const DEFAULT_SUBJECTS = ["DSA", "Web Dev", "Mathematics", "Physics", "Chemistry", "English", "General"];

function useSubjects() {
  const [subjects, setSubjects] = useState<string[]>(() => {
    const saved = localStorage.getItem("flux-subjects");
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  useEffect(() => {
    localStorage.setItem("studyforge-subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects((prev) => [...prev, trimmed]);
    }
  };

  const removeSubject = (name: string) => {
    if (subjects.length > 1) {
      setSubjects((prev) => prev.filter((s) => s !== name));
    }
  };

  return { subjects, addSubject, removeSubject };
}

export default function StudySessionLogger({ onSessionSave }: Props) {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [subject, setSubject] = useState("General");
  const [notes, setNotes] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [showSubjectInput, setShowSubjectInput] = useState(false);
  const { subjects, addSubject, removeSubject } = useSubjects();
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem("studyforge-sessions");
    return saved ? JSON.parse(saved) : [];
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem("studyforge-sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Keep subject valid
  useEffect(() => {
    if (!subjects.includes(subject)) {
      setSubject(subjects[0] || "General");
    }
  }, [subjects, subject]);

  const toggleTimer = () => setRunning(!running);

  const stopAndSave = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (elapsed > 0) {
      const hours = parseFloat((elapsed / 3600).toFixed(2));
      const session: StudySession = {
        id: crypto.randomUUID(),
        subject,
        duration: elapsed,
        date: new Date().toISOString(),
        notes,
      };
      setSessions((prev) => [session, ...prev]);
      onSessionSave(hours);
    }

    setElapsed(0);
    setNotes("");
    setOpen(false);
  }, [elapsed, subject, notes, onSessionSave]);

  const resetTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed(0);
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject(newSubject.trim());
      setSubject(newSubject.trim());
      setNewSubject("");
      setShowSubjectInput(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const todaySessions = sessions.filter(
    (s) => new Date(s.date).toDateString() === new Date().toDateString()
  );
  const todayTotal = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground gap-2">
          <Clock className="w-4 h-4" />
          Log Study Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Log Study Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Timer Display */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-center py-6 rounded-2xl bg-secondary"
          >
            <span className="text-5xl font-display font-bold tabular-nums text-foreground">
              {formatTime(elapsed)}
            </span>
            <p className="text-xs text-muted-foreground mt-2">
              {running ? "Session in progress..." : elapsed > 0 ? "Session paused" : "Ready to start"}
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={toggleTimer}
              size="lg"
              className={`gap-2 px-6 ${running ? "bg-warning text-warning-foreground hover:bg-warning/90" : "gradient-primary text-primary-foreground"}`}
            >
              {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {running ? "Pause" : "Start"}
            </Button>
            {elapsed > 0 && (
              <Button variant="outline" size="lg" onClick={resetTimer}>
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Subject & Notes */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <div className="flex gap-2">
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center justify-between w-full gap-2">
                          <span>{s}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSubjectInput(!showSubjectInput)}
                  title="Add subject"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                {subjects.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSubject(subject)}
                    title="Remove current subject"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
              {showSubjectInput && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="New subject name"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                    maxLength={30}
                  />
                  <Button size="sm" onClick={handleAddSubject} disabled={!newSubject.trim()}>
                    Add
                  </Button>
                </div>
              )}
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Notes (optional)</Label>
              <Input
                placeholder="What did you study?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Save */}
          {elapsed > 0 && !running && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={stopAndSave} className="w-full gradient-success text-success-foreground gap-2">
                <Save className="w-4 h-4" />
                Save Session ({(elapsed / 3600).toFixed(1)}h)
              </Button>
            </motion.div>
          )}

          {/* Today's summary */}
          {todaySessions.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground mb-2">
                Today: {todaySessions.length} session{todaySessions.length > 1 ? "s" : ""} · {(todayTotal / 3600).toFixed(1)}h total
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {todaySessions.map((s) => (
                  <div key={s.id} className="flex justify-between text-xs bg-secondary rounded-lg px-3 py-1.5">
                    <span className="font-medium text-foreground">{s.subject}</span>
                    <span className="text-muted-foreground">{(s.duration / 3600).toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
