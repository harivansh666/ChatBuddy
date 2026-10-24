import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSend: (message: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput = ({
  onSend,
  onTyping,
  onStopTyping,
  disabled,
  placeholder = "type something...",
}: MessageInputProps) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    // Emit typing event
    onTyping?.();

    // Reset stop-typing debounce timer (1.5s after last keystroke)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.();
    }, 1500);
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    // Clear typing state on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onStopTyping?.();
    onSend(value.trim());
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-end gap-2 bg-input rounded-2xl px-4 py-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent resize-none text-sm outline-none placeholder:text-muted-foreground min-h-[36px] max-h-[120px] py-1.5"
          style={{ height: "auto", overflow: "hidden" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = Math.min(target.scrollHeight, 120) + "px";
          }}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="h-8 w-8 rounded-xl shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
