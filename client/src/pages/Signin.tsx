import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/config/axios";
import { useAppStore } from "@/stores/useAppStore";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth } = useAppStore();
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    console.log("response", response.data);
    if (response.status === 200) {
      setAuth(
        response.data.user.id,
        response.data.user.nickname,
        response.data.user.avatar,
      );

      console.log(response.data.user.nickname, response.data.user.avatar);

      toast({
        title: "Success!",
        description: "You've successfully signed in.",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            🧠
          </motion.div>
          <h1 className="text-4xl font-display font-bold tracking-tight">
            Welcome Back <span className="text-primary italic">!</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Ready for another session with{" "}
            <span className="text-primary font-semibold">VentAI</span>?
          </p>
        </div>

        <div className="glass glass-border rounded-3xl p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSignin} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input/50 border-border rounded-xl h-12 pl-11 group-focus-within:border-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input/50 border-border rounded-xl h-12 pl-11 group-focus-within:border-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-display font-bold text-base mt-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </span>
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline transition-all"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
