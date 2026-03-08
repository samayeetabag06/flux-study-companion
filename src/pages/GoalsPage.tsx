import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface Subject {
  id: string;
  name: string;
  targetHours: number;
  completedHours: number;
}

const defaultSubjects: Subject[] = [
  { id: "1", name: "Data Structures & Algorithms", targetHours: 100, completedHours: 45 },
  { id: "2", name: "Web Development", targetHours: 80, completedHours: 30 },
  { id: "3", name: "Mathematics", targetHours: 60, completedHours: 25 },
  { id: "4", name: "Cybersecurity", targetHours: 40, completedHours: 15 },
];

export default function GoalsPage() {
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const addSubject = () => {
    if (!newName || !newTarget) return;
    setSubjects((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: newName, targetHours: Number(newTarget), completedHours: 0 },
    ]);
    setNewName("");
    setNewTarget("");
  };

  const removeSubject = (id: string) => setSubjects((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-display font-bold text-foreground"
      >
        Goals & Subjects
      </motion.h1>

      {/* Add Subject */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-5 shadow-card"
      >
        <h3 className="font-display font-semibold text-card-foreground mb-3">Add New Subject</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="Subject name" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
          <Input placeholder="Target hours" type="number" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} className="w-32" />
          <Button onClick={addSubject} className="gradient-primary text-primary-foreground gap-1">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </motion.div>

      {/* Subjects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject, i) => {
          const pct = Math.round((subject.completedHours / subject.targetHours) * 100);
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-5 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-card-foreground text-sm">{subject.name}</h3>
                </div>
                <button onClick={() => removeSubject(subject.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">{subject.completedHours}h / {subject.targetHours}h</span>
                <span className="font-semibold text-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
              {pct >= 100 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-success font-medium">
                  <Check className="w-3 h-3" /> Goal achieved!
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
