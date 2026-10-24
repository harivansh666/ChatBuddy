import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppStore, Message } from "@/stores/useAppStore";
import { getAIResponse, getCheerUp } from "@/lib/mockData";
import ChatHeader from "@/components/layout/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInput from "@/components/chat/MessageInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import PersonalitySwitcher from "@/components/ai/PersonalitySwitcher";
import CheerUpButton from "@/components/ai/CheerUpButton";
import MoodChartCard from "@/components/mood/MoodChartCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosInstance from "@/config/axios";
import { Clock } from "lucide-react";

interface GroupedMessages {
  date: string;
  messages: Message[];
}

const AIChat = () => {
  const { personality, nickname, isAITyping, setIsAITyping } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAITyping]);

  useEffect(() => {
    axiosInstance
      .get("/ai-history")
      .then((res: any) => {
        if (res.data.messages && res.data.messages.length > 0) {
          const mappedMessages: Message[] = res.data.messages.map((m: any) => ({
            id: m.id.toString(),
            content: m.content,
            sender: m.isAI ? "VentBot" : "user",
            timestamp: new Date(m.createdAt),
            isAI: m.isAI,
            personality: m.personality,
          }));
          setMessages(mappedMessages);
        } else {
          // Add welcome message if no history
          setMessages([
            {
              id: "welcome",
              content: `hey ${nickname || "friend"}! 👋 i'm VentBot, your anonymous college buddy. vent away — no judgments here. 💜`,
              sender: "VentBot",
              timestamp: new Date(),
              isAI: true,
              personality: "comfort",
            },
          ]);
        }
      })
      .catch((err) => {
        console.error("Failed to load AI history:", err);
        // Fallback welcome message
        setMessages([
          {
            id: "welcome",
            content: `hey ${nickname || "friend"}! 👋 i'm VentBot, your anonymous college buddy. vent away — no judgments here. 💜`,
            sender: "VentBot",
            timestamp: new Date(),
            isAI: true,
            personality: "comfort",
          },
        ]);
      });
  }, [nickname]);

  const sendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsAITyping(true);

    try {
      const response = await axiosInstance.post("/ai-chat", {
        prompt: content,
        personality,
      });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.aiResponse,
        sender: "VentBot",
        timestamp: new Date(),
        isAI: true,
        personality,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAITyping(false);
    }
  };

  const groupMessages = (msgs: Message[]): GroupedMessages[] => {
    const groups: { [key: string]: Message[] } = {};
    msgs.forEach((msg) => {
      const date = new Date(msg.timestamp).toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return Object.keys(groups).map((date) => ({
      date,
      messages: groups[date],
    }));
  };

  const groupedMessages = groupMessages(messages);

  const handleCheerUp = async () => {
    setIsAITyping(true);
    const joke = await getCheerUp();
    const aiMsg: Message = {
      id: Date.now().toString(),
      content: joke,
      sender: "VentBot",
      timestamp: new Date(),
      isAI: true,
      personality,
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsAITyping(false);
  };

  return (
    <div className="flex flex-1 min-w-0 h-screen overflow-hidden">
      {/* Left History Sidebar (Desktop) */}
      <div className="w-64 border-r border-border bg-card/10 hidden xl:flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">History</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {groupedMessages.map((group, idx) => (
              <div key={idx} className="mb-4">
                <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {group.date}
                </p>
                {group.messages
                  .filter((m) => !m.isAI)
                  .slice(0, 3)
                  .map((m, midx) => (
                    <button
                      key={midx}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-xs truncate"
                    >
                      {m.content}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        <ChatHeader />
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-8 max-w-4xl mx-auto w-full">
            {groupedMessages.map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                <div className="flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-secondary/30 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    {group.date}
                  </span>
                </div>
                {group.messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    personality={msg.personality || personality}
                    isUser={msg.sender === "user"}
                  />
                ))}
              </div>
            ))}
            <AnimatePresence>
              {isAITyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        <div className="p-4 bg-gradient-to-t from-background to-transparent pt-8">
          <div className="max-w-4xl mx-auto">
            <MessageInput
              onSend={sendMessage}
              disabled={isAITyping}
              placeholder="vent away..."
            />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-64 h-screen border-l border-border p-4 space-y-6 overflow-y-auto scrollbar-thin hidden lg:block bg-card/10">
        <PersonalitySwitcher />
        <CheerUpButton onClick={handleCheerUp} disabled={isAITyping} />
        <MoodChartCard />
      </div>
    </div>
  );
};

export default AIChat;
