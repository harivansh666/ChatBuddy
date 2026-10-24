import MoodChartCard from "@/components/mood/MoodChartCard";
import { mockMoodHistory } from "@/lib/mockData";
import { motion } from "framer-motion";

const MoodPage = () => {
  const todayMood = mockMoodHistory[mockMoodHistory.length - 1];

  return (
    <div className="flex-1 p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold">Mood Tracker</h1>
        <p className="text-sm text-muted-foreground">how you&apos;ve been feeling this week 📊</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="glass glass-border rounded-2xl p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">today&apos;s vibe</p>
          <p className="text-5xl">{todayMood.emoji}</p>
          <p className="text-lg font-display font-semibold">{todayMood.mood}/5</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <MoodChartCard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="glass glass-border rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">😊</p>
          <p className="text-xs text-muted-foreground">best day</p>
          <p className="text-sm font-semibold">Friday</p>
        </div>
        <div className="glass glass-border rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">😢</p>
          <p className="text-xs text-muted-foreground">rough day</p>
          <p className="text-sm font-semibold">Thursday</p>
        </div>
      </motion.div>
    </div>
  );
};

export default MoodPage;
