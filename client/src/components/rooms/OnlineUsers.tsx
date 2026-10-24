const OnlineUsers = () => {
  const users = [
    { name: "anxious_andy", emoji: "😎", online: true },
    { name: "stressed_sarah", emoji: "🌸", online: true },
    { name: "chill_charlie", emoji: "🐸", online: true },
    { name: "study_sam", emoji: "📚", online: false },
    { name: "meme_lord", emoji: "🤡", online: false },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Online</h3>
      <div className="space-y-1">
        {users.filter(u => u.online).map((u) => (
          <div key={u.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
            <span className="text-sm">{u.emoji}</span>
            <span className="text-xs text-foreground">{u.name}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-online ml-auto" />
          </div>
        ))}
        {users.filter(u => !u.online).map((u) => (
          <div key={u.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg opacity-40">
            <span className="text-sm">{u.emoji}</span>
            <span className="text-xs">{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;
