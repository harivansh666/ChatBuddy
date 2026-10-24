// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate, Link } from "react-router-dom";
// import { useAppStore, getRandomAvatar } from "@/stores/useAppStore";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const AuthPage = () => {
//   const [nickname, setNickname] = useState("");
//   const [avatar, setAvatar] = useState(());
//   const setAuth = useAppStore((s) => s.setAuth);

//   const rerollAvatar = () => setAvatar(getRandomAvatar());

//   const handleJoin = () => {
//     if (nickname.trim().length < 2) return;
//     setAuth(nickname.trim(), avatar);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="w-full max-w-sm"
//       >
//         <div className="text-center mb-8">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//             className="text-6xl mb-4"
//           >
//             🧠
//           </motion.div>
//           <h1 className="text-3xl font-display font-bold tracking-tight">
//             Vent<span className="text-primary">AI</span>
//           </h1>
//           <p className="text-muted-foreground mt-2 text-sm">
//             your anonymous college bestie 💬
//           </p>
//         </div>

//         <div className="glass glass-border rounded-2xl p-6 space-y-6">
//           {/* Avatar */}
//           <div className="flex flex-col items-center gap-3">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={rerollAvatar}
//               className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-4xl cursor-pointer hover:ring-2 ring-primary/50 transition-all"
//             >
//               {avatar}
//             </motion.button>
//             <span className="text-xs text-muted-foreground">tap to reroll</span>
//           </div>

//           {/* Nickname */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-muted-foreground">pick a nickname</label>
//             <Input
//               value={nickname}
//               onChange={(e) => setNickname(e.target.value)}
//               placeholder="anonymous_goat_42"
//               maxLength={20}
//               className="bg-input border-border rounded-xl h-12 text-center font-medium"
//               onKeyDown={(e) => e.key === "Enter" && handleJoin()}
//             />
//           </div>

//           {/* Join */}
//           <Button
//             onClick={handleJoin}
//             disabled={nickname.trim().length < 2}
//             className="w-full h-12 rounded-xl font-display font-semibold text-base"
//           >
//             enter the chat 🚀
//           </Button>

//           <p className="text-xs text-center text-muted-foreground">
//             no email. no password. just vibes. ✌️
//           </p>

//           <div className="pt-2 border-t border-border/50">
//             <p className="text-xs text-center text-muted-foreground">
//               Want a registered account?{" "}
//               <Link to="/signin" className="text-primary hover:underline font-medium">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AuthPage;
