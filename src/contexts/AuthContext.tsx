import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const SESSION_KEY = "flux-user";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_KEY = "flux-last-activity";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  year: string;
  bio: string;
  avatar: string;
  loggedIn: boolean;
  lastLogin: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (!parsed.loggedIn) return null;
      // Check session timeout
      const lastActivity = localStorage.getItem(ACTIVITY_KEY);
      if (lastActivity && Date.now() - Number(lastActivity) > SESSION_TIMEOUT) {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(ACTIVITY_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Track activity for session timeout
  useEffect(() => {
    if (!user) return;
    const updateActivity = () => localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
    updateActivity();
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateActivity, { passive: true }));
    const interval = setInterval(() => {
      const last = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
      if (Date.now() - last > SESSION_TIMEOUT) {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(ACTIVITY_KEY);
      }
    }, 60_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, [user]);

  const login = useCallback((email: string, name?: string) => {
    // Check if existing user
    const existing = localStorage.getItem(SESSION_KEY);
    let profile: UserProfile;
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email === email) {
        profile = { ...parsed, loggedIn: true, lastLogin: new Date().toISOString() };
      } else {
        profile = createNewProfile(email, name);
      }
    } else {
      profile = createNewProfile(email, name);
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...user, loggedIn: false }));
    }
    localStorage.removeItem(ACTIVITY_KEY);
    setUser(null);
  }, [user]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

function createNewProfile(email: string, name?: string): UserProfile {
  return {
    name: name || email.split("@")[0],
    email,
    phone: "",
    institution: "",
    course: "",
    year: "",
    bio: "",
    avatar: "",
    loggedIn: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
