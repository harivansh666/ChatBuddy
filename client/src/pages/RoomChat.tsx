import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppStore, Message } from "@/stores/useAppStore";
import { mockRoomMessages, mockRooms } from "@/lib/mockData";
import ChatHeader from "@/components/layout/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInput from "@/components/chat/MessageInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import OnlineUsers from "@/components/rooms/OnlineUsers";
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosInstance from "@/config/axios";
import { Bot } from "lucide-react";

// Map room names to their AI bot flavour label + emoji
const ROOM_AI_FLAVORS: Record<
  string,
  { label: string; emoji: string; hint: string }
> = {
  "Late Night Study": {
    label: "NightOwl AI",
    emoji: "🌙",
    hint: "Your cozy 2am study buddy is here",
  },
  "Vent Zone": {
    label: "VentBot",
    emoji: "😤",
    hint: "Vent away, bestie — no judgment",
  },
  "CS 101 Survivors": {
    label: "CodeBot",
    emoji: "💻",
    hint: "Your fellow survivor with a debugger",
  },
  "Dorm Floor 3": {
    label: "DormBot",
    emoji: "🏠",
    hint: "Your nosy neighbor AI",
  },
};

const RoomChat = () => {
  const { activeRoomId, nickname, personality } = useAppStore();
  const [messages, setMessages] = useState<Message[]>(mockRoomMessages);
  const [isAITyping, setIsAITyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAITyping]);

  const room = mockRooms.find((r) => r.id === activeRoomId);
  const roomFlavor = room ? ROOM_AI_FLAVORS[room.name] : null;
  const botName = roomFlavor?.label ?? "VentBot";

  const sendMessage = async (content: string) => {
    // Add user message immediately
    const msg: Message = {
      id: Date.now().toString(),
      content,
      sender: nickname,
      timestamp: new Date(),
      status: "sent",
    };
    setMessages((prev) => [...prev, msg]);

    // Trigger AI reply
    setIsAITyping(true);
    try {
      const response = await axiosInstance.post("/ai-chat", {
        prompt: content,
        personality: personality.toUpperCase(),
        rooms: room?.name ?? "",
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.aiResponse,
        sender: botName,
        timestamp: new Date(),
        isAI: true,
        personality,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Room AI Error:", error);
    } finally {
      setIsAITyping(false);
    }
  };

  if (!room) return null;

  return (
    <div className="flex flex-1 min-w-0">
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader />

        {/* Room AI flavour banner */}
        {roomFlavor && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-accent/5 text-xs text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot className="w-3 h-3 text-accent" />
            </div>
            <span className="font-semibold text-accent ">
              {roomFlavor.emoji} {roomFlavor.label}
            </span>
            <span className="opacity-60">·</span>
            <span>{roomFlavor.hint}</span>
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isUser={msg.sender === nickname}
                personality={msg.personality || personality}
              />
            ))}
            <AnimatePresence>
              {isAITyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <MessageInput
          onSend={sendMessage}
          disabled={isAITyping}
          placeholder={
            roomFlavor
              ? `message ${roomFlavor.emoji} #${room.name}...`
              : `message #${room.name}...`
          }
        />
      </div>

      {/* Right Panel */}
      <div className="w-64 h-screen border-l border-border p-4 space-y-6 overflow-y-auto scrollbar-thin hidden lg:block">
        <OnlineUsers />
      </div>
    </div>
  );
};

export default RoomChat;
