import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Calendar,
  Timer,
  BarChart3,
  UserCircle,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/calendar", icon: Calendar, label: "Cal" },
  { to: "/pomodoro", icon: Timer, label: "Focus" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-2 py-1">
      <div className="flex justify-around">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[10px] font-medium transition-colors
                ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
