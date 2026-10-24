import { useAppStore } from "@/stores/useAppStore";
import AppSidebar from "@/components/layout/AppSidebar";
// import AuthPage from "@/pages/AuthPage";
import AIChat from "@/pages/AIChat";
import RoomChat from "@/pages/RoomChat";
import MoodPage from "@/pages/MoodPage";
import FriendsChat from "@/pages/FriendsChat";
import MemeSwipe from "@/pages/MemeSwipe";
import Signin from "./Signin";
import { useEffect } from "react";
import { socketConnection } from "@/config/ws";

const Index = () => {
  const { isAuthenticated, activeView, activeRoomId, connectSocket } =
    useAppStore();
  console.log("isAuthenticated: ", isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    }
  }, [isAuthenticated, activeRoomId]);

  if (!isAuthenticated) return <Signin />;

  const renderContent = () => {
    if (activeView === "room-chat" && activeRoomId) return <RoomChat />;
    if (activeView === "mood") return <MoodPage />;
    if (activeView === "friends-chat") return <FriendsChat />;
    if (activeView === "meme-swipe") return <MemeSwipe />;
    return <AIChat />;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      {renderContent()}
    </div>
  );
};

export default Index;
