import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Study hard, for the well is deep, and our brains are shallow.", author: "Richard Baxter" },
  { text: "There is no substitute for hard work.", author: "Thomas Edison" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "What we learn with pleasure we never forget.", author: "Alfred Mercier" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function MotivationalQuote() {
  const dayOfYear = getDayOfYear();
  const quote = quotes[dayOfYear % quotes.length];

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
