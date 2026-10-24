import { motion } from "framer-motion";

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="flex items-end gap-2 px-4"
  >
    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs">🤖</div>
    <div className="message-bubble-ai flex items-center gap-1.5 py-3 px-5">
      <div className="w-2 h-2 rounded-full bg-accent animate-typing-dot-1" />
      <div className="w-2 h-2 rounded-full bg-accent animate-typing-dot-2" />
      <div className="w-2 h-2 rounded-full bg-accent animate-typing-dot-3" />
    </div>
  </motion.div>
);

export default TypingIndicator;
