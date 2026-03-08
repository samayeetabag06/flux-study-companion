import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, BookOpen, Calendar, Save, LogOut, Shield, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AVATAR_OPTIONS = [
  "🧑‍🎓", "👩‍🎓", "👨‍💻", "👩‍💻", "🧑‍🔬", "👩‍🔬", "🧑‍🏫", "👩‍🏫",
];

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    institution: user?.institution || "",
    course: user?.course || "",
    year: user?.year || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "🧑‍🎓",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (form.name.length > 50) errs.name = "Name is too long.";
    if (form.phone && !/^[\d+\-() ]{7,20}$/.test(form.phone)) errs.phone = "Enter a valid phone number.";
    if (form.institution.length > 100) errs.institution = "Institution name is too long.";
    if (form.course.length > 100) errs.course = "Course name is too long.";
    if (form.bio.length > 300) errs.bio = "Bio must be under 300 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      institution: form.institution.trim(),
      course: form.course.trim(),
      year: form.year,
      bio: form.bio.trim(),
      avatar: form.avatar,
    });
    toast({ title: "Profile updated!", description: "Your details have been saved." });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Student Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your student information and preferences</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              {/* Avatar picker */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-5xl border-4 border-primary/20">
                  {form.avatar}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => update("avatar", emoji)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                      form.avatar === emoji
                        ? "bg-primary/20 ring-2 ring-primary scale-110"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="w-full space-y-2 text-left text-xs text-muted-foreground border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Member since</span>
                  <span className="font-medium text-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last login</span>
                  <span className="font-medium text-foreground">{new Date(user.lastLogin).toLocaleString()}</span>
                </div>
              </div>
              <Button variant="destructive" className="w-full mt-2 gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Student Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="pl-10"
                      maxLength={50}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={user.email} disabled className="pl-10 opacity-60" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 9876543210"
                      className="pl-10"
                      maxLength={20}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Institution / University</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.institution}
                      onChange={(e) => update("institution", e.target.value)}
                      placeholder="IIT Delhi, MIT, etc."
                      className="pl-10"
                      maxLength={100}
                    />
                  </div>
                  {errors.institution && <p className="text-xs text-destructive">{errors.institution}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Course / Program</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={form.course}
                      onChange={(e) => update("course", e.target.value)}
                      placeholder="B.Tech CSE, BSc Physics, etc."
                      className="pl-10"
                      maxLength={100}
                    />
                  </div>
                  {errors.course && <p className="text-xs text-destructive">{errors.course}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Year of Study</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      value={form.year}
                      onChange={(e) => update("year", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Bio ({form.bio.length}/300)</Label>
                <textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="Tell us about yourself and your study goals..."
                  maxLength={300}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
                {errors.bio && <p className="text-xs text-destructive">{errors.bio}</p>}
              </div>

              <Button onClick={handleSave} className="gradient-primary text-primary-foreground gap-2">
                <Save className="w-4 h-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="shadow-card mt-6">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base">
                <Shield className="w-5 h-5 text-success" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Password protected with strong validation (8+ chars, uppercase, number, special)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Rate limiting: Account locks after 5 failed login attempts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Auto session timeout after 30 minutes of inactivity
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Input sanitization against XSS and injection attacks
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
