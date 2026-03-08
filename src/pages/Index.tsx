import { useState } from "react";
import CountdownCard from "@/components/CountdownCard";
import StudyTrackerCard from "@/components/StudyTrackerCard";
import WeeklyChart from "@/components/WeeklyChart";
import SubjectBreakdown from "@/components/SubjectBreakdown";
import QuickActions from "@/components/QuickActions";
import MotivationalQuote from "@/components/MotivationalQuote";
import AddGoalDialog from "@/components/AddGoalDialog";
import StudySessionLogger from "@/components/StudySessionLogger";
import { motion } from "framer-motion";

const defaultGoals = [
  { id: "1", name: "JEE Mains", date: "2026-05-15", color: "blue" },
  { id: "2", name: "Web Dev Cert", date: "2026-04-20", color: "orange" },
];

export default function Index() {
  const [goals, setGoals] = useState(defaultGoals);
  const [studyData, setStudyData] = useState({
    todayHours: 3.5,
    weekHours: 24,
    monthTarget: 200,
    monthHours: 87,
  });

  const addGoal = (goal: { id: string; name: string; date: string; color: string }) => {
    setGoals((prev) => [...prev, goal]);
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const updateStudy = (field: "todayHours" | "weekHours" | "monthHours" | "monthTarget", value: number) => {
    setStudyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSessionSave = (hours: number) => {
    setStudyData((prev) => ({
      ...prev,
      todayHours: parseFloat((prev.todayHours + hours).toFixed(2)),
      weekHours: parseFloat((prev.weekHours + hours).toFixed(2)),
      monthHours: parseFloat((prev.monthHours + hours).toFixed(2)),
    }));
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{greeting}, Scholar 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Stay consistent, stay ahead.</p>
        </div>
        <div className="flex gap-2">
          <StudySessionLogger onSessionSave={handleSessionSave} />
          <AddGoalDialog onAdd={addGoal} />
        </div>
      </motion.div>

      {/* Countdown Timers */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <CountdownCard key={goal.id} goal={goal} onRemove={removeGoal} />
          ))}
        </div>
      )}

      {/* Study Stats & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StudyTrackerCard
          todayHours={studyData.todayHours}
          weekHours={studyData.weekHours}
          monthTarget={studyData.monthTarget}
          monthHours={studyData.monthHours}
          onUpdate={updateStudy}
        />
        <WeeklyChart />
        <div className="space-y-4">
          <QuickActions />
          <MotivationalQuote />
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SubjectBreakdown />
      </div>
    </div>
  );
}
