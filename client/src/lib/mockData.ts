import { Message, Personality } from "@/stores/useAppStore";

const comfortResponses = [
  "Hey, I hear you. College is tough, but you're tougher. 💪",
  "That sounds really stressful. Take a deep breath — you're doing better than you think. 🫂",
  "It's okay to feel this way. Everyone struggles sometimes, and it doesn't make you weak. 💜",
  "You're not alone in this. I'm here for you, always. 🌟",
  "Sometimes the best thing to do is just breathe and take it one step at a time. 🌸",
  "Remember: you've survived 100% of your worst days so far. That's pretty impressive. ✨",
];

const mentorResponses = [
  "Let's break this down. What's the ONE thing you can control right now? 🎯",
  "I get it — but let's think strategically. What would future you thank you for doing today? 🧠",
  "Here's the thing: stress means you care. Now let's channel that energy productively. 📈",
  "Every expert was once a beginner. What small step can you take in the next 10 minutes? 🚀",
  "Failure isn't the opposite of success — it's part of it. What did you learn? 💡",
  "Your GPA doesn't define your worth, but your habits define your trajectory. Let's build better ones. 📊",
];

const savageResponses = [
  "Bestie, you're stressed about THAT? 💀 Touch grass and come back.",
  "Okay dramatic much?? The assignment isn't gonna cry itself to sleep — get to work 😭🔥",
  "You want a hug or you want results? Because I only deal in results, fam. 💅",
  "That professor is rent-free in your head and NOT paying. Evict them. 🏠❌",
  "Babe, you're giving main character energy but the plot is mid. Spice it up. 🎬",
  "Crying won't fix your GPA but studying might. Just saying. 🤷‍♀️💀",
];

const cheerUpJokes = [
  "Why did the student eat his homework? Because his teacher told him it was a piece of cake! 🍰😂",
  "What's a college student's favorite type of music? Debt metal. 🎸💸",
  "I told my professor I'd be late to class because of my alarm. He said 'That's not alarming.' 😭⏰",
  "Why don't college students ever win at poker? They always fold under pressure! 🃏",
  "My GPA and my bank account have something in common: they're both way lower than I'd like. 📉😂",
  "College is just paying thousands of dollars to be told to read the textbook yourself. 📚🤡",
];

const getRandomResponse = (responses: string[]) =>
  responses[Math.floor(Math.random() * responses.length)];

export const getAIResponse = (
  message: string,
  personality: Personality,
): Promise<string> => {
  return new Promise((resolve) => {
    const delay = 800 + Math.random() * 1500;
    setTimeout(() => {
      switch (personality) {
        case "comfort":
          resolve(getRandomResponse(comfortResponses));
          break;
        case "mentor":
          resolve(getRandomResponse(mentorResponses));
          break;
        case "savage":
          resolve(getRandomResponse(savageResponses));
          break;
      }
    }, delay);
  });
};

export const getCheerUp = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getRandomResponse(cheerUpJokes)), 600);
  });
};

export const mockRooms = [
  {
    id: "1",
    name: "CS 101 Survivors",
    emoji: "💻",
    members: 24,
    unread: 3,
    lastMessage: "anyone got the notes?",
  },
  {
    id: "2",
    name: "Dorm Floor 3",
    emoji: "🏠",
    members: 12,
    unread: 0,
    lastMessage: "who stole my charger again",
  },
  {
    id: "3",
    name: "Late Night Study",
    emoji: "🌙",
    members: 8,
    unread: 1,
    lastMessage: "caffeine check ☕",
  },
  {
    id: "4",
    name: "Vent Zone",
    emoji: "😤",
    members: 45,
    unread: 7,
    lastMessage: "this prof is wild fr",
  },
  {
    id: "5",
    name: "Meme Dump",
    emoji: "🤡",
    members: 67,
    unread: 0,
    lastMessage: "lmaooo",
  },
];

export const mockMoodHistory: { date: string; mood: number; emoji: string }[] =
  [
    { date: "Mon", mood: 3, emoji: "😐" },
    { date: "Tue", mood: 2, emoji: "😔" },
    { date: "Wed", mood: 4, emoji: "😊" },
    { date: "Thu", mood: 1, emoji: "😢" },
    { date: "Fri", mood: 5, emoji: "🥳" },
    { date: "Sat", mood: 4, emoji: "😊" },
    { date: "Sun", mood: 3, emoji: "😐" },
  ];

export const mockRoomMessages: Message[] = [
  {
    id: "r1",
    content: "yo anyone else dying from that exam?",
    sender: "anxious_andy",
    timestamp: new Date(Date.now() - 300000),
    isAI: false,
  },
  {
    id: "r2",
    content: "literally crying rn 😭",
    sender: "stressed_sarah",
    timestamp: new Date(Date.now() - 240000),
    isAI: false,
  },
  {
    id: "r3",
    content:
      "Don't worry! Studies show that perceived difficulty correlates with better long-term retention. You'll thank yourselves later. 🧠✨",
    sender: "VentBot",
    timestamp: new Date(Date.now() - 180000),
    isAI: true,
  },
  {
    id: "r4",
    content: "nobody asked you bot 💀",
    sender: "chill_charlie",
    timestamp: new Date(Date.now() - 120000),
    isAI: false,
  },
  {
    id: "r5",
    content: "nah fr tho the bot spittin",
    sender: "anxious_andy",
    timestamp: new Date(Date.now() - 60000),
    isAI: false,
  },
];

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage: string;
  unreadCount?: number;
  lastActive: string;
}

export const mockFriends: Friend[] = [
  {
    id: "f1",
    name: "Sarah W.",
    avatar: "🌸",
    status: "online",
    lastMessage: "did you check the quiz?",
    unreadCount: 2,
    lastActive: "Just now",
  },
  {
    id: "f2",
    name: "Alex Chen",
    avatar: "⚡",
    status: "offline",
    lastMessage: "gym tonight?",
    lastActive: "2h ago",
  },
  {
    id: "f3",
    name: "Jake (Bio)",
    avatar: "🐸",
    status: "online",
    lastMessage: "sent a photo",
    unreadCount: 0,
    lastActive: "5m ago",
  },
  {
    id: "f4",
    name: "Emily Smith",
    avatar: "🎨",
    status: "online",
    lastMessage: "i'm around if you need to talk!",
    lastActive: "Just now",
  },
  {
    id: "f5",
    name: "Professor K.",
    avatar: "🎓",
    status: "offline",
    lastMessage: "Check the portal for updates.",
    lastActive: "1d ago",
  },
];

export const mockFriendMessages: Record<string, Message[]> = {
  f1: [
    {
      id: "m1",
      content: "hey! how's the prep going?",
      sender: "Sarah W.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isAI: false,
    },
    {
      id: "m2",
      content: "i'm so stuck on problem 4",
      sender: "Sarah W.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isAI: false,
    },
    {
      id: "m3",
      content: "did you check the quiz?",
      sender: "Sarah W.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isAI: false,
    },
  ],
  f4: [
    {
      id: "m4",
      content: "hey, i saw your vent earlier.",
      sender: "Emily Smith",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isAI: false,
    },
    {
      id: "m5",
      content: "i'm around if you need to talk!",
      sender: "Emily Smith",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isAI: false,
    },
  ],
};

export interface Meme {
  id: string;
  title: string;
  url: string;
}

export const mockMemes: Meme[] = [
  {
    id: "1",
    title: "When the code works on the first try",
    url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
  },
  {
    id: "2",
    title: "Monday morning vibes",
    url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
  },
  {
    id: "3",
    title: "Me after 5 minutes of studying",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  },
  {
    id: "4",
    title: "Living on caffeine and dreams",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  },
  {
    id: "5",
    title: "The bug that was actually a feature",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
];
