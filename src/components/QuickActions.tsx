import { motion } from "framer-motion";
import { Play, Plus, BookOpen, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  { icon: Play, label: "Start Session", color: "gradient-primary", route: "/pomodoro" },
  { icon: Plus, label: "Log Hours", color: "gradient-success", route: "/" },
  { icon: BookOpen, label: "Flashcards", color: "gradient-accent", route: "/flashcards" },
  { icon: Timer, label: "Quick Timer", color: "gradient-primary", route: "/pomodoro" },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl bg-card border border-border p-5 shadow-card"
    >
      <h3 className="font-display font-semibold text-card-foreground mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ icon: Icon, label, color, route }) => (
          <button
            key={label}
            onClick={() => navigate(route)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground"
          >
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
              <Icon className="w-4 h-4 text-primary-foreground" />
            </div>
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
