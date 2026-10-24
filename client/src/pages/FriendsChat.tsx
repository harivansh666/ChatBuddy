import { useState, useRef, useEffect } from "react";
import { useAppStore, Message } from "@/stores/useAppStore";
import { mockFriends, mockFriendMessages, Friend } from "@/lib/mockData";
import MessageInput from "@/components/chat/MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical, CheckCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/config/axios";
import UserTypingIndicator from "@/components/chat/UserTypingIndicator";

const FriendsChat = () => {
  const {
    activeFriendId,
    setActiveFriendId,
    nickname,
    onlineUsers,
    socket,
    userId,
  } = useAppStore();
  const [isPending, setIsPending] = useState(false);
  const [friendIsTyping, setFriendIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredFriends = users.filter((u) =>
    u.nickname.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeFriend = users.find((u) => u.id.toString() === activeFriendId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
        console.log("onlineUsers: ", onlineUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeFriendId) return;
      try {
        const res = await axiosInstance.get(`/users/${activeFriendId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [activeFriendId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      const isFromActiveFriend =
        newMessage.senderId.toString() === activeFriendId ||
        newMessage.recipientId.toString() === activeFriendId;

      if (isFromActiveFriend) {
        setMessages((prev) => [...prev, newMessage]);
        setIsPending(false);
      }
    };

    const handleUserTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === activeFriendId) setFriendIsTyping(true);
    };

    const handleUserStopTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === activeFriendId) setFriendIsTyping(false);
    };

    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
    };
  }, [socket, activeFriendId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!activeFriendId) return;
    try {
      await axiosInstance.post("/users/message-sent", {
        content,
        receiverId: activeFriendId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = () => {
    if (!socket || !activeFriendId) return;
    socket.emit("typing", { receiverId: activeFriendId });
  };

  const handleStopTyping = () => {
    if (!socket || !activeFriendId) return;
    socket.emit("stop-typing", { receiverId: activeFriendId });
  };

  return (
    <div className="flex flex-1 h-screen bg-background overflow-hidden">
      {/* Friends List (WhatsApp Style) */}
      <div
        className={`w-full md:w-80 flex flex-col border-r border-border ${activeFriendId ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 space-y-4 bg-card/30 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Messages</h2>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              className="pl-9 bg-secondary/50 border-none rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => setActiveFriendId(friend.id.toString())}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    activeFriendId === friend.id.toString()
                      ? "bg-primary/10 ring-1 ring-primary/20"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
                      {friend.avatar || "👤"}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${onlineUsers.includes(friend.id.toString()) ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="font-semibold text-sm truncate">
                        {friend.nickname}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      Tap to start chatting
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground text-sm">
                No users found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col bg-background relative ${!activeFriendId ? "hidden md:flex" : "flex"}`}
      >
        {activeFriend ? (
          <>
            <div className="p-4 flex items-center gap-3 border-b border-border bg-card/30 backdrop-blur-md">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setActiveFriendId(null)}
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                {activeFriend.avatar || "👤"}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {activeFriend.nickname}
                </h3>
                <p className="text-[10px] text-online">
                  {onlineUsers.includes(activeFriend.id.toString()) ? (
                    <span className="text-online">online</span>
                  ) : (
                    <span className="text-offline">offline</span>
                  )}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 opacity-70"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 opacity-70"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id ?? msg.createdAt}
                      className={`flex ${msg.senderId.toString() === userId.toString() ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 relative ${
                          msg.senderId.toString() === userId.toString()
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-secondary text-secondary-foreground rounded-tl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 opacity-60`}
                        >
                          <span className="text-[9px]">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {msg.senderId.toString() === userId.toString() && (
                            <CheckCheck className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 mt-20">
                    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-4xl mb-4">
                      💬
                    </div>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                {friendIsTyping && <UserTypingIndicator />}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="p-4 bg-card/10">
              <MessageInput
                onSend={sendMessage}
                onTyping={handleTyping}
                onStopTyping={handleStopTyping}
                placeholder="Type a message..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center text-5xl mb-6 ai-glow">
              🤝
            </div>
            <h3 className="text-xl font-display font-medium mb-2">
              Select a friend to start chatting
            </h3>
            <p className="max-w-xs text-center text-sm">
              Connect with your college besties anonymously or jump into their
              vibes!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsChat;
