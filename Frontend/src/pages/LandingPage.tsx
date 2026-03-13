import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "@/components/LandingNavbar";
import FoxyWelcome from "@/components/FoxyWelcome";
import foxyMascot from "@/assets/foxy-mascot.png";
import { BookOpen, Brain, BarChart3, Compass, Sparkles, Zap, Target, GraduationCap, ArrowRight, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";

const features = [
  { icon: Brain, title: "Learning Style Detection", desc: "Discover how you learn best with our AI-powered quiz", color: "bg-secondary" },
  { icon: BookOpen, title: "AI Study Summarizer", desc: "Instantly summarize complex study materials", color: "bg-accent" },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track grades, study hours, and quiz scores", color: "bg-highlight" },
  { icon: Compass, title: "Career Recommendations", desc: "Get personalized career paths based on your skills", color: "bg-rose" },
  { icon: Zap, title: "Flashcards System", desc: "Interactive flip cards for quick revision", color: "bg-badge" },
  { icon: Target, title: "Gamified Learning", desc: "Earn XP, badges, and maintain streaks", color: "bg-primary" },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your free account in seconds" },
  { num: "02", title: "Take the Quiz", desc: "Discover your unique learning style" },
  { num: "03", title: "Study Smart", desc: "Use AI tools to boost your learning" },
  { num: "04", title: "Track & Grow", desc: "Monitor progress and level up" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const LandingPage = () => {
  const loggedIn = isAuthenticated();

  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <FoxyWelcome />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-40 right-1/4 w-20 h-20 bg-rose/30 rounded-full blur-2xl animate-float" />

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/60 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" /> AI-Powered Learning Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Learn Smarter with{" "}
                <span className="text-gradient">EduVision AI</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-muted-foreground text-lg leading-relaxed"
              >
                AI-powered personalized learning and career guidance for students.
                Discover your learning style, generate summaries, and track your growth.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <Link to={loggedIn ? "/dashboard" : "/signup"} className="px-8 py-3.5 rounded-2xl gradient-primary font-semibold hover-lift inline-flex items-center gap-2">
                  Start Learning <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to={loggedIn ? "/dashboard" : "/login"} className="px-8 py-3.5 rounded-2xl glass-card font-semibold hover-lift">
                  Explore Dashboard
                </Link>
              </motion.div>
            </div>

            {/* Right - Foxy */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative flex justify-center"
            >
              {/* Foxy with waving, winking, studying animation sequence */}
              <motion.div className="relative w-64 md:w-80 lg:w-96">
                <motion.img
                  src={foxyMascot}
                  alt="Foxy - AI Learning Companion"
                  className="w-full drop-shadow-2xl"
                  animate={{
                    y: [0, -15, 0, -5, 0],
                    rotate: [0, -5, 5, -3, 0],
                    scale: [1, 1.05, 1, 1.03, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.7, 1],
                  }}
                />
                {/* Waving hand emoji */}
                <motion.div
                  className="absolute top-2 right-4 text-4xl"
                  animate={{
                    rotate: [0, 20, -10, 20, -10, 0],
                    opacity: [0, 1, 1, 1, 1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    times: [0, 0.1, 0.2, 0.3, 0.35, 0.4],
                  }}
                >
                  👋
                </motion.div>
                {/* Winking eye */}
                <motion.div
                  className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl"
                  animate={{
                    opacity: [0, 0, 1, 1, 0, 0],
                    scale: [0.5, 0.5, 1, 1.2, 0.5, 0.5],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    times: [0, 0.4, 0.45, 0.55, 0.6, 1],
                  }}
                >
                  😉
                </motion.div>
                {/* Studying book */}
                <motion.div
                  className="absolute bottom-4 left-4 text-3xl"
                  animate={{
                    opacity: [0, 0, 0, 1, 1, 0],
                    y: [10, 10, 10, 0, -5, 10],
                    rotate: [0, 0, 0, -10, 5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    times: [0, 0.5, 0.6, 0.7, 0.85, 1],
                  }}
                >
                  📖
                </motion.div>
                {/* Sparkle effects during studying */}
                <motion.div
                  className="absolute top-0 left-8 text-2xl"
                  animate={{
                    opacity: [0, 0, 0, 0.8, 1, 0],
                    scale: [0, 0, 0, 1, 1.3, 0],
                    y: [0, 0, 0, -10, -20, -30],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    times: [0, 0.6, 0.65, 0.75, 0.85, 1],
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>

              {/* Speech bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-4 right-0 md:right-4 glass-card-strong rounded-2xl rounded-br-sm px-5 py-3 max-w-[200px]"
              >
                <p className="text-sm font-medium">Hi! I'm Foxy 🦊</p>
                <p className="text-xs text-muted-foreground">Your AI learning companion.</p>
              </motion.div>

              {/* Floating elements around Foxy */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 left-0 text-3xl">📚</motion.div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute bottom-10 left-5 text-3xl">⭐</motion.div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 right-0 text-3xl">🧠</motion.div>
              <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-5 right-10 text-3xl">🎓</motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">Everything You Need to Excel</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">How It Works</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">Start Learning in 4 Steps</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 font-display font-bold text-xl">
                  {s.num}
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="glass-card-strong rounded-3xl p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            <motion.img
              src={foxyMascot}
              alt=""
              className="w-16 h-16 mx-auto mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of students using AI to study smarter, not harder.
            </p>
            <Link to="/signup" className="px-8 py-3.5 rounded-2xl gradient-primary font-semibold hover-lift inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 font-display text-lg font-bold mb-3">
                <img src={foxyMascot} alt="Foxy" className="w-8 h-8" /> EduVision AI
              </div>
              <p className="text-muted-foreground text-sm mb-4">Empowering students with AI-powered personalized learning tools.</p>
              <div className="flex gap-3">
                {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#features" className="block hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="block hover:text-foreground transition-colors">How It Works</a>
                <Link to="/login" className="block hover:text-foreground transition-colors">Log In</Link>
                <Link to="/signup" className="block hover:text-foreground transition-colors">Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About Us</a>
                <a href="#" className="block hover:text-foreground transition-colors">Contact</a>
                <a href="#" className="block hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
            © 2026 EduVision AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
