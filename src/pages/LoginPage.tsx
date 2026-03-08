import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import fluxLogo from "@/assets/flux-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60_000;

function sanitize(input: string): string {
  return input.replace(/[<>"'&]/g, "").trim();
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function validatePassword(pw: string): { valid: boolean; message: string } {
  if (pw.length < 8) return { valid: false, message: "Password must be at least 8 characters." };
  if (!/[A-Z]/.test(pw)) return { valid: false, message: "Password needs an uppercase letter." };
  if (!/[0-9]/.test(pw)) return { valid: false, message: "Password needs a number." };
  if (!/[^A-Za-z0-9]/.test(pw)) return { valid: false, message: "Password needs a special character." };
  return { valid: true, message: "" };
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const attemptsRef = useRef(0);
  const lockedUntilRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || "/";
    navigate(from, { replace: true });
    return null;
  }

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (isSignUp && !sanitize(form.name)) errs.name = "Name is required.";
    if (!validateEmail(form.email)) errs.email = "Enter a valid email address.";
    const pwCheck = validatePassword(form.password);
    if (!pwCheck.valid) errs.password = pwCheck.message;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Date.now() < lockedUntilRef.current) {
      const remaining = Math.ceil((lockedUntilRef.current - Date.now()) / 1000);
      toast({ title: "Too many attempts", description: `Account locked. Try again in ${remaining}s.`, variant: "destructive" });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    attemptsRef.current += 1;

    if (attemptsRef.current >= MAX_ATTEMPTS) {
      lockedUntilRef.current = Date.now() + LOCKOUT_DURATION;
      attemptsRef.current = 0;
      toast({ title: "Account temporarily locked", description: "Too many attempts. Please wait 1 minute.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const cleanEmail = sanitize(form.email).toLowerCase();
    const cleanName = sanitize(form.name);

    setTimeout(() => {
      login(cleanEmail, cleanName || undefined);
      attemptsRef.current = 0;
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: "Redirecting to dashboard...",
      });
      setLoading(false);
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }, 800);
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">Flux</h1>
          <p className="text-white/80 text-lg max-w-sm">
            Your personal study companion. Track progress, build habits, and ace your exams.
          </p>
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {["Goal tracking & countdowns", "Smart study analytics", "Pomodoro timer & flashcards", "Student profile & verification"].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-white/90 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3" />
                </div>
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-xs">
            <Shield className="w-4 h-4" />
            <span>Secured with encryption & rate limiting</span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">Flux</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Start your study journey today" : "Sign in to continue studying"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isSignUp && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-muted-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} className="pl-10" maxLength={50} autoComplete="name" />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="student@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} className="pl-10" required maxLength={255} autoComplete="email" />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => update("password", e.target.value)} className="pl-10 pr-10" required maxLength={128} autoComplete={isSignUp ? "new-password" : "current-password"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              {isSignUp && (
                <p className="text-[10px] text-muted-foreground">Min 8 chars, 1 uppercase, 1 number, 1 special character</p>
              )}
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => { setIsSignUp(!isSignUp); setErrors({}); }} className="text-primary font-medium hover:underline">
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
