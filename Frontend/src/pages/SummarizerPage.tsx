import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import summaries from "@/data/summaries.json";
import { Copy, Download, Sparkles, Loader2, BookOpen } from "lucide-react";

const SummarizerPage = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof summaries.examples[0] | null>(null);

  const generate = () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * summaries.examples.length);
      setResult(summaries.examples[idx]);
      setLoading(false);
    }, 2000);
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary.join("\n"));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-2">📝 AI Study Summarizer</h1>
      <p className="text-muted-foreground mb-6">Paste your study material and get an instant AI summary.</p>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your study material here..."
          className="w-full h-40 bg-muted/50 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-ring/30 resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={generate} disabled={loading || !input.trim()}
            className="px-6 py-2.5 rounded-xl gradient-primary font-semibold hover-lift disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Summary
          </button>
          <button className="px-6 py-2.5 rounded-xl glass-card font-medium hover-lift flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Upload PDF
          </button>
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-3">Analyzing your material with AI...</p>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-semibold text-lg">📖 {result.topic}</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-accent/50">{result.difficulty}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={copy} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Copy">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {result.summary.map((point, i) => (
                <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{point}</span>
                </motion.div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">KEY TERMS</h3>
              <div className="flex flex-wrap gap-2">
                {result.keyTerms.map((term) => (
                  <span key={term} className="px-3 py-1 rounded-full bg-badge/30 text-xs font-medium">{term}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SummarizerPage;
