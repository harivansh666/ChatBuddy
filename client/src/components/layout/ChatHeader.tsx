import { useAppStore, Personality } from "@/stores/useAppStore";
import { Bot, Users, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockRooms } from "@/lib/mockData";

const personalityEmoji: Record<Personality, string> = {
  comfort: "🤗",
  mentor: "🧠",
  savage: "🔥",
};

const ChatHeader = () => {
  const { activeView, activeRoomId, personality } = useAppStore();

  if (activeView === "ai-chat") {
    return (
      <div className="h-16 px-6 flex items-center gap-3 border-b border-border glass">
        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center ai-glow">
          <Bot className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-sm">VentBot</h2>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-accent/30 text-accent"
            >
              AI {personalityEmoji[personality]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            always online • {personality} mode
          </p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-online" />
      </div>
    );
  }

  if (activeView === "room-chat" && activeRoomId) {
    const room = mockRooms.find((r) => r.id === activeRoomId);
    if (!room) return null;
    return (
      <div className="h-16 px-6 flex items-center gap-3 border-b border-border glass">
        <span className="text-2xl">{room.emoji}</span>
        <div>
          <h2 className="font-display font-semibold text-sm">{room.name}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" /> {room.members} members
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatHeader;
