import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import performanceData from "@/data/performanceData.json";
import { TrendingUp, TrendingDown } from "lucide-react";

const AnalyticsPage = () => {
  const { overview, subjects, weeklyStudyHours, quizPerformance, strengths, improvements } = performanceData;

  const overviewCards = [
    { label: "GPA", value: overview.gpa.toString(), color: "bg-secondary" },
    { label: "Attendance", value: `${overview.attendance}%`, color: "bg-accent" },
    { label: "Assignments", value: `${overview.assignmentsCompleted}/${overview.totalAssignments}`, color: "bg-highlight" },
    { label: "Quiz Score", value: `${overview.quizScore}%`, color: "bg-rose" },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="font-display text-2xl font-bold">📊 Performance Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5 hover-lift"
          >
            <div className={`w-3 h-3 ${c.color} rounded-full mb-2`} />
            <p className="font-display text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Subject performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Subject-wise Performance</h2>
        <div className="space-y-3 mb-6">
          {subjects.map((s) => (
            <div key={s.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.score}% ({s.grade})</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.score}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full gradient-primary rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={subjects}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly hours */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg mb-4">📈 Weekly Study Hours</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyStudyHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quiz trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg mb-4">📝 Quiz Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={quizPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="quiz" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Strengths</h2>
          <div className="space-y-2">
            {strengths.map((s) => (
              <div key={s} className="flex items-center gap-2 p-3 bg-primary/10 rounded-xl text-sm font-medium">
                ✅ {s}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg mb-3 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-destructive" /> Needs Improvement</h2>
          <div className="space-y-2">
            {improvements.map((s) => (
              <div key={s} className="flex items-center gap-2 p-3 bg-destructive/10 rounded-xl text-sm font-medium">
                ⚠️ {s}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
