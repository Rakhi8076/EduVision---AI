import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import learningData from "@/data/learningStyleData.json";
import { CheckCircle, ChevronRight } from "lucide-react";

type StyleKey = "visual" | "reading" | "auditory" | "kinesthetic";

const LearningStylePage = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<StyleKey[]>([]);
  const [result, setResult] = useState<StyleKey | null>(null);
  const questions = learningData.questions;

  const selectAnswer = (style: StyleKey) => {
    const newAnswers = [...answers, style];
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      // Calculate result
      const counts: Record<string, number> = {};
      newAnswers.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as StyleKey;
      setResult(winner);
    }
  };

  const reset = () => { setCurrent(0); setAnswers([]); setResult(null); };

  if (result) {
    const r = learningData.results[result];
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card rounded-3xl p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="text-6xl mb-4">
            {r.icon}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-5xl mb-2">🎉</motion.div>
          <h2 className="font-display text-2xl font-bold mb-2">{r.title}</h2>
          <p className="text-muted-foreground mb-6">{r.description}</p>

          <div className="text-left">
            <h3 className="font-display font-semibold mb-3">Recommended Methods:</h3>
            <div className="space-y-2">
              {r.recommendations.map((rec, i) => (
                <motion.div key={rec} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">{rec}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <button onClick={reset} className="mt-6 px-6 py-2.5 rounded-xl gradient-primary font-semibold hover-lift">
            Retake Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-2">🧠 Learning Style Detection</h1>
      <p className="text-muted-foreground mb-6">Answer {questions.length} questions to discover how you learn best.</p>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{Math.round(((current) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div animate={{ width: `${(current / questions.length) * 100}%` }} className="h-full gradient-primary rounded-full" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-display text-lg font-semibold mb-4">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt) => (
              <button key={opt.text} onClick={() => selectAnswer(opt.style as StyleKey)}
                className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-primary/20 border border-transparent hover:border-primary/30 transition-all flex items-center justify-between group"
              >
                <span className="text-sm">{opt.text}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LearningStylePage;
