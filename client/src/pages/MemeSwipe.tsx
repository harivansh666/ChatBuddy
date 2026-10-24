import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { mockMemes } from "@/lib/mockData";
import { Heart, X, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MemeSwipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);

  const memes = mockMemes;

  const swipe = (direction: string) => {
    setLastDirection(direction);
    if (currentIndex < memes.length) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setLastDirection(null);
      }, 300);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      swipe("right");
    } else if (info.offset.x < -100) {
      swipe("left");
    }
  };

  const currentMeme = memes[currentIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-sidebar/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
            🤡
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Meme Dump</h2>
            <p className="text-xs text-muted-foreground">Swipe your mood</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20"
        >
          {memes.length - currentIndex} memes left
        </Badge>
      </div>

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative perspective-1000">
        <AnimatePresence>
          {currentIndex < memes.length ? (
            <motion.div
              key={currentMeme.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x:
                  lastDirection === "right"
                    ? 500
                    : lastDirection === "left"
                      ? -500
                      : 0,
                rotate:
                  lastDirection === "right"
                    ? 20
                    : lastDirection === "left"
                      ? -20
                      : 0,
              }}
              exit={{
                x:
                  lastDirection === "right"
                    ? 1000
                    : lastDirection === "left"
                      ? -1000
                      : 0,
                opacity: 0,
                rotate:
                  lastDirection === "right"
                    ? 45
                    : lastDirection === "left"
                      ? -45
                      : 0,
                transition: { duration: 0.4 },
              }}
              className="absolute w-full max-w-[400px] aspect-[3/4] cursor-grab active:cursor-grabbing z-10"
              style={{ x: 0 }}
            >
              <div className="w-full h-full glass glass-border rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <div className="flex-1 relative bg-muted overflow-hidden">
                  <img
                    src={currentMeme.url}
                    alt={currentMeme.title}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <h3 className="text-white font-display font-bold text-xl leading-tight">
                      {currentMeme.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="text-6xl mb-6">🏜️</div>
              <h2 className="text-2xl font-display font-bold">
                End of the dump!
              </h2>
              <p className="text-muted-foreground">
                You've reached the bottom of the meme vault.
              </p>
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(0)}
                className="rounded-full gap-2"
              >
                <RotateCcw className="h-4 w-4" /> Restart
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="p-8 flex items-center justify-center gap-6 pb-12 sticky bottom-0">
        <Button
          size="icon"
          variant="outline"
          disabled={currentIndex >= memes.length}
          onClick={() => swipe("left")}
          className="w-14 h-14 rounded-full border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all shadow-lg hover:shadow-destructive/20"
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full border-accent/20 text-accent"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          disabled={currentIndex >= memes.length}
          onClick={() => swipe("right")}
          className="w-14 h-14 rounded-full border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/20"
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default MemeSwipe;
