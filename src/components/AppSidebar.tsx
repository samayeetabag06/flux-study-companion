import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Calendar,
  Timer,
  BarChart3,
  BookOpen,
  Trophy,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import fluxLogo from "@/assets/flux-logo.png";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/pomodoro", icon: Timer, label: "Pomodoro" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/flashcards", icon: BookOpen, label: "Flashcards" },
];

export default function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground min-h-screen p-4 gap-2">
      <div className="flex items-center gap-3 px-3 py-4 mb-4">
        <img src={fluxLogo} alt="Flux logo" className="h-10 w-auto object-contain" />
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile link */}
      <NavLink
        to="/profile"
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-2
          ${location.pathname === "/profile"
            ? "bg-sidebar-accent text-sidebar-primary"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`}
      >
        <div className="w-[18px] h-[18px] flex items-center justify-center text-sm">
          {user?.avatar || "🧑‍🎓"}
        </div>
        <span className="truncate">{user?.name || "Profile"}</span>
      </NavLink>

      <div className="px-3 py-4 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-sidebar-foreground/90">Daily Streak</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-display font-bold text-accent">7</span>
          <span className="text-xs text-sidebar-foreground/60">days</span>
        </div>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <div key={d} className="w-5 h-5 rounded-full gradient-accent flex items-center justify-center">
              <Flame className="w-3 h-3 text-accent-foreground" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
