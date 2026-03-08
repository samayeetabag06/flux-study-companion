import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
];

export default function MotivationalQuote() {
  const today = new Date().getDay();
  const quote = quotes[today % quotes.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50 p-5"
    >
      <Quote className="w-5 h-5 text-primary/40 mb-2" />
      <p className="text-sm italic text-foreground/80 leading-relaxed">"{quote.text}"</p>
      <p className="text-xs text-muted-foreground mt-2">— {quote.author}</p>
    </motion.div>
  );
}
