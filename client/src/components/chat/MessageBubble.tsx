import { motion } from "framer-motion";
import { Message, Personality } from "@/stores/useAppStore";
import { Bot, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MessageBubbleProps {
  message: Message;
  personality?: Personality;
  isUser: boolean;
  onRetry?: () => void;
}

const MessageBubble = ({ message, personality, isUser, onRetry }: MessageBubbleProps) => {
  const isSavage = personality === "savage" && message.isAI;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
          message.isAI ? "bg-accent/20" : "bg-secondary"
        }`}>
          {message.isAI ? "🤖" : message.sender.charAt(0).toUpperCase()}
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {/* Sender name for non-user, non-AI */}
        {!isUser && !message.isAI && (
          <span className="text-[10px] text-muted-foreground px-1">{message.sender}</span>
        )}

        <div className={`${
          isUser
            ? "message-bubble-user"
            : message.isAI
              ? `message-bubble-ai ${isSavage ? "savage" : ""}`
              : "message-bubble-ai"
        }`}>
          {message.isAI && (
            <div className="flex items-center gap-1.5 mb-1">
              <Badge variant="outline" className="text-[9px] px-1 py-0 border-accent/30 text-accent h-4">
                <Bot className="h-2.5 w-2.5 mr-0.5" /> AI
              </Badge>
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {message.status === "failed" && onRetry && (
            <button onClick={onRetry} className="text-destructive hover:text-destructive/80 transition-colors">
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
