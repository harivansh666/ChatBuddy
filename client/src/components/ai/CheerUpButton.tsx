import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheerUpButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CheerUpButton = ({ onClick, disabled }: CheerUpButtonProps) => (
  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary/10 h-10 gap-2"
    >
      <Sparkles className="h-4 w-4" />
      cheer me up ✨
    </Button>
  </motion.div>
);

export default CheerUpButton;
