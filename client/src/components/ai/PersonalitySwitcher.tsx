import { useAppStore, Personality } from "@/stores/useAppStore";
import { motion } from "framer-motion";

const modes: { key: Personality; label: string; emoji: string; desc: string }[] = [
  { key: "comfort", label: "Comfort", emoji: "🤗", desc: "gentle & supportive" },
  { key: "mentor", label: "Mentor", emoji: "🧠", desc: "tough love & guidance" },
  { key: "savage", label: "Savage", emoji: "🔥", desc: "no filter. brutal." },
];

const personalityBg: Record<Personality, string> = {
  comfort: "bg-comfort/15 border-comfort/30 text-comfort",
  mentor: "bg-mentor/15 border-mentor/30 text-mentor",
  savage: "bg-savage/15 border-savage/30 text-savage",
};

const PersonalitySwitcher = () => {
  const { personality, setPersonality } = useAppStore();

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">AI Personality</h3>
      <div className="space-y-1.5">
        {modes.map((m) => (
          <motion.button
            key={m.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPersonality(m.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
              personality === m.key
                ? personalityBg[m.key]
                : "border-transparent text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <span className="text-lg">{m.emoji}</span>
            <div>
              <p className="text-sm font-medium">{m.label}</p>
              <p className="text-[10px] opacity-70">{m.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PersonalitySwitcher;
