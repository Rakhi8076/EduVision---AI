import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import flashcardsData from "@/data/flashcardsData.json";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const FlashcardsPage = () => {
  const [deckIdx, setDeckIdx] = useState<number | null>(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (deckIdx === null) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-2">🃏 Flashcards</h1>
        <p className="text-muted-foreground mb-6">Choose a deck to start studying.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {flashcardsData.decks.map((deck, i) => (
            <motion.button key={deck.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => { setDeckIdx(i); setCardIdx(0); setFlipped(false); }}
              className="glass-card rounded-2xl p-6 text-left hover-lift"
            >
              <span className="text-3xl">{deck.emoji}</span>
              <h3 className="font-display font-semibold mt-3">{deck.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{deck.cards.length} cards</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const deck = flashcardsData.decks[deckIdx];
  const card = deck.cards[cardIdx];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { setDeckIdx(null); }} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Decks
        </button>
        <span className="text-sm text-muted-foreground">{cardIdx + 1} / {deck.cards.length}</span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-8">
        <motion.div animate={{ width: `${((cardIdx + 1) / deck.cards.length) * 100}%` }} className="h-full gradient-primary rounded-full" />
      </div>

      {/* Card */}
      <div className="perspective-1000 cursor-pointer mb-8" onClick={() => setFlipped(!flipped)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${cardIdx}-${flipped}`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-3xl p-10 min-h-[250px] flex flex-col items-center justify-center text-center"
          >
            <span className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
              {flipped ? "Answer" : "Question"}
            </span>
            <p className="font-display text-xl font-semibold">{flipped ? card.back : card.front}</p>
            <p className="text-xs text-muted-foreground mt-4">Click to flip</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => { setCardIdx(Math.max(0, cardIdx - 1)); setFlipped(false); }}
          disabled={cardIdx === 0}
          className="p-3 rounded-xl glass-card hover-lift disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setFlipped(false)} className="p-3 rounded-xl glass-card hover-lift">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={() => { setCardIdx(Math.min(deck.cards.length - 1, cardIdx + 1)); setFlipped(false); }}
          disabled={cardIdx === deck.cards.length - 1}
          className="p-3 rounded-xl glass-card hover-lift disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
