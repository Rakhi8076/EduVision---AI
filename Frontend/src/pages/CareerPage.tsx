import { useState } from "react";
import { motion } from "framer-motion";
import careerData from "@/data/careerData.json";
import { TrendingUp, BookOpen, Target, User, Compass } from "lucide-react";

const iconMap: Record<string, any> = { TrendingUp, BookOpen, Target, User };

type CareerKey = keyof typeof careerData.careers;

const allCareers = Object.entries(careerData.careers) as [CareerKey, typeof careerData.careers[CareerKey]][];

const CareerPage = () => {
  const [selected, setSelected] = useState<CareerKey>("data");
  const career = careerData.careers[selected];
  const IconComponent = iconMap[career.icon] || TrendingUp;

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Career Path Guidance</h1>
            <p className="text-muted-foreground text-sm">Explore career paths tailored to your skills and interests</p>
          </div>
        </div>
      </motion.div>

      {/* Featured Career Card */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 bg-secondary/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <IconComponent className="w-7 h-7 text-primary" />
          <h2 className="font-display text-2xl font-bold">{career.title}</h2>
        </div>
        <p className="text-muted-foreground mb-6">{career.description}</p>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-sm text-muted-foreground">Salary Range</p>
            <p className="font-display text-xl font-bold">{career.salary}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Job Growth</p>
            <p className="font-display text-xl font-bold text-primary">{career.growth}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Demand</p>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-6 rounded-sm ${i < career.demand ? "bg-foreground" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">Key Skills Required:</p>
          <div className="flex flex-wrap gap-2">
            {career.skills.map((s) => (
              <span key={s} className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Other Career Paths */}
      <div>
        <h3 className="font-display text-xl font-bold mb-4">Other Career Paths</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCareers.map(([key, c]) => {
            const Icon = iconMap[c.icon] || TrendingUp;
            return (
              <motion.button
                key={key}
                whileHover={{ y: -3 }}
                onClick={() => setSelected(key)}
                className={`glass-card rounded-2xl p-5 text-left transition-all ${
                  selected === key ? "ring-2 ring-primary" : "hover:shadow-lg"
                }`}
              >
                <Icon className="w-6 h-6 mb-3 text-primary" />
                <p className="font-display font-bold">{c.title}</p>
                <p className="text-sm text-primary mt-1">{c.salary}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Learning Path Roadmap */}
      <motion.div
        key={`path-${selected}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8"
      >
        <h3 className="font-display text-xl font-bold mb-6">Recommended Learning Path:</h3>
        <div className="space-y-0">
          {career.learningPath.map((step, i) => (
            <div key={i} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-display font-bold shrink-0">
                  {step.step}
                </div>
                {i < career.learningPath.length - 1 && (
                  <div className="w-0.5 h-12 bg-border" />
                )}
              </div>
              <div className="pb-8">
                <p className="text-sm text-primary">{step.duration}</p>
                <p className="font-display font-bold">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-3 rounded-xl bg-foreground text-background font-semibold hover-lift mt-4">
          Get Personalized Roadmap
        </button>
      </motion.div>
    </div>
  );
};

export default CareerPage;
