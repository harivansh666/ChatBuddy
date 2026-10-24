import { motion } from "framer-motion";
import {
  useAppStore,
  Personality,
  getRandomAvatar,
} from "@/stores/useAppStore";
import { mockRooms } from "@/lib/mockData";
import { MessageCircle, BarChart3, Plus, LogOut, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const personalityColors: Record<Personality, string> = {
  comfort: "bg-comfort/20 text-comfort",
  mentor: "bg-mentor/20 text-mentor",
  savage: "bg-savage/20 text-savage",
};

const AppSidebar = () => {
  const {
    nickname,
    activeView,
    setActiveView,
    activeRoomId,
    setActiveRoomId,
    personality,
    logout,
  } = useAppStore();

  const [avatar, setAvatar] = useState(getRandomAvatar());

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 h-screen flex flex-col bg-sidebar border-r border-sidebar-border shrink-0"
    >
      {/* Profile */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm truncate">
            {nickname}
          </p>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${personalityColors[personality]}`}
          >
            {personality} mode
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* AI Chat */}
          <button
            onClick={() => {
              setActiveView("ai-chat");
              setActiveRoomId(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
              activeView === "ai-chat" && !activeRoomId
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">AI Chat</p>
              <p className="text-xs text-muted-foreground truncate">
                your anonymous bestie
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-online animate-pulse-glow" />
          </button>

          {/* With Friends */}
          <button
            onClick={() => {
              setActiveView("friends-chat");
              setActiveRoomId(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
              activeView === "friends-chat"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">With Friends</p>
              <p className="text-xs text-muted-foreground truncate">
                Chat with your friends
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-online animate-pulse-glow" />
          </button>

          {/* Mood Tracker */}
          <button
            onClick={() => {
              setActiveView("mood");
              setActiveRoomId(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
              activeView === "mood"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-medium">Mood Tracker</p>
          </button>

          <Separator className="bg-sidebar-border my-2" />

          {/* Rooms Header */}
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rooms
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Room List */}
          {mockRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                if (room.name === "Meme Dump") {
                  setActiveView("meme-swipe");
                  setActiveRoomId(null);
                } else {
                  setActiveView("room-chat");
                  setActiveRoomId(room.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                activeRoomId === room.id ||
                (room.name === "Meme Dump" && activeView === "meme-swipe")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <span className="text-lg">{room.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{room.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {room.lastMessage}
                </p>
              </div>
              {room.unread > 0 && (
                <Badge className="bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center text-[10px] px-1.5">
                  {room.unread}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </motion.aside>
  );
};

export default AppSidebar;
