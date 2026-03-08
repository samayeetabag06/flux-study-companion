import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

const defaultCards: Flashcard[] = [
  { id: "1", front: "What is Big O notation?", back: "A mathematical notation that describes the upper bound of an algorithm's time or space complexity." },
  { id: "2", front: "What is a Binary Search Tree?", back: "A tree data structure where each node has at most two children, and left child < parent < right child." },
  { id: "3", front: "What is TCP/IP?", back: "A suite of communication protocols used to interconnect network devices on the internet." },
];

export default function FlashcardsPage() {
  const [cards, setCards] = useState(defaultCards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  const card = cards[index];

  const nextCard = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };
  const prevCard = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  const addCard = () => {
    if (!newFront || !newBack) return;
    setCards((prev) => [...prev, { id: crypto.randomUUID(), front: newFront, back: newBack }]);
    setNewFront("");
    setNewBack("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">Flashcards</h1>
        <Button onClick={() => setShowAdd(!showAdd)} variant="outline" size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> New Card
        </Button>
      </motion.div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-2xl bg-card border border-border p-5 shadow-card space-y-3">
          <Input placeholder="Question (front)" value={newFront} onChange={(e) => setNewFront(e.target.value)} />
          <Textarea placeholder="Answer (back)" value={newBack} onChange={(e) => setNewBack(e.target.value)} />
          <Button onClick={addCard} className="gradient-primary text-primary-foreground">Add Card</Button>
        </motion.div>
      )}

      {cards.length > 0 && (
        <div className="flex flex-col items-center gap-6">
          <motion.div
            onClick={() => setFlipped(!flipped)}
            className="w-full max-w-lg aspect-[3/2] rounded-2xl bg-card border border-border shadow-elevated cursor-pointer flex items-center justify-center p-8 transition-all hover:shadow-card"
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? "back" : "front"}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                {!flipped ? (
                  <>
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Question</p>
                    <p className="text-lg font-display font-semibold text-card-foreground">{card.front}</p>
                    <p className="text-xs text-muted-foreground mt-4">Tap to reveal</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-success mb-3 uppercase tracking-wider font-semibold">Answer</p>
                    <p className="text-base text-card-foreground leading-relaxed">{card.back}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={prevCard}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm text-muted-foreground font-medium tabular-nums">
              {index + 1} / {cards.length}
            </span>
            <Button variant="outline" size="icon" onClick={nextCard}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
