import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { Mail, User, Award, Flame, Star } from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = getCurrentUser();
    setUser(data);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-6">👤 Profile</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center font-display font-bold text-2xl">
            {(user?.name || "S").charAt(0)}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{user?.name || "Student"}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Mail className="w-4 h-4" /> {user?.email || "student@example.com"}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
            <Flame className="w-6 h-6 text-destructive" />
            <div>
              <p className="font-bold">5 Days</p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
            <Star className="w-6 h-6 text-accent-foreground" />
            <div>
              <p className="font-bold">120 XP</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
            <Award className="w-6 h-6 text-primary" />
            <div>
              <p className="font-bold">3</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold mb-3">Account Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium">{user?.name || "Student"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user?.email || "student@example.com"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="text-sm font-medium">{user?.age || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="text-sm font-medium">{user?.gender || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">College</p>
                <p className="text-sm font-medium">{user?.college || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Course</p>
                <p className="text-sm font-medium">{user?.course || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
