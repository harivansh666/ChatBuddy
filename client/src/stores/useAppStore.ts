import { create } from "zustand";
import { Socket } from "socket.io-client";
import { socketConnection } from "@/config/ws";

export type Personality = "comfort" | "mentor" | "savage";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | string;
  timestamp: Date;
  isAI?: boolean;
  personality?: Personality;
  status?: "sending" | "sent" | "failed";
}

export interface Room {
  id: string;
  name: string;
  emoji: string;
  members: number;
  unread: number;
  lastMessage?: string;
}

export interface MoodEntry {
  date: string;
  mood: number; // 1-5
  emoji: string;
}

export interface AppState {
  // Socket
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;

  // Auth
  nickname: string;
  avatar: string;
  userId: string;
  isAuthenticated: boolean;
  setAuth: (userId: string, nickname: string, avatar: string) => void;
  logout: () => void;

  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;

  // Personality
  personality: Personality;
  setPersonality: (p: Personality) => void;

  // Active view
  activeView: "ai-chat" | "room-chat" | "mood" | "friends-chat" | "meme-swipe";
  setActiveView: (
    v: "ai-chat" | "room-chat" | "mood" | "friends-chat" | "meme-swipe",
  ) => void;

  // Active room / friend
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;
  activeFriendId: string | null;
  setActiveFriendId: (id: string | null) => void;

  // Typing
  isAITyping: boolean;
  setIsAITyping: (v: boolean) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;

  // Midnight mode
  isMidnight: boolean;
  checkMidnight: () => void;
}

const AVATARS = [
  "😎",
  "🤖",
  "👻",
  "🦊",
  "🐸",
  "🌸",
  "⚡",
  "🔥",
  "💀",
  "🎭",
  "🧠",
  "🌙",
  "🎯",
  "🫠",
  "🤡",
  "👽",
  "🦄",
  "🍄",
];

export const getRandomAvatar = () =>
  AVATARS[Math.floor(Math.random() * AVATARS.length)];

export const useAppStore = create<AppState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  setOnlineUsers: (users: string[]) => set({ onlineUsers: users }),
  setSocket: (socket: Socket | null) => set({ socket }),

  connectSocket: () => {
    const { isAuthenticated } = get();

    if (!isAuthenticated || get().socket?.connected) return;

    const newSocket = socketConnection(get().userId);
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (users: string[]) => {
      set({ onlineUsers: users });
    });
  },
  disconnectSocket: () => {
    if (!get().socket?.connected) get().socket?.disconnect();
    set({ socket: null });
  },
  nickname: "",
  avatar: "",
  isAuthenticated: false,
  userId: "",

  setAuth: (userId, nickname, avatar) =>
    set({ userId, nickname, avatar, isAuthenticated: true }),

  logout: () => {
    get().disconnectSocket();
    set({
      nickname: "",
      avatar: "",
      isAuthenticated: false,
    });
  },

  personality: "comfort",
  setPersonality: (p) => set({ personality: p }),

  activeView: "ai-chat",
  setActiveView: (v) => set({ activeView: v }),

  activeRoomId: null,
  setActiveRoomId: (id) => set({ activeRoomId: id }),
  activeFriendId: null,
  setActiveFriendId: (id) => set({ activeFriendId: id }),

  isAITyping: false,
  setIsAITyping: (v) => set({ isAITyping: v }),

  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  isMidnight: false,
  checkMidnight: () => {
    const hour = new Date().getHours();
    set({ isMidnight: hour >= 0 && hour < 5 });
  },
}));
