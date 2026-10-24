import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ReceiptPoundSterlingIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/config/axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/signup", {
        nickname,
        email,
        password,
      });
      if (response.status === 201 || response.status === 200) {
        toast({
          title: "Success",
          description: "Account created successfully.",
          variant: "default",
        });
        navigate("/signin");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast({
        title: "Signup Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            Join <span className="text-primary italic">VentAI</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Start your journey with your anonymous bestie.
          </p>
        </div>

        <div className="glass glass-border rounded-3xl p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="nickname"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                Nickname
              </Label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Enter your nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-input/50 border-border rounded-xl h-12 pl-11 group-focus-within:border-primary/50 transition-all"
                  required
                />
              </div>
            </div>
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

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-muted-foreground ml-1"
              >
                Confirm Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? "Creating account..." : "Sign Up"}
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </span>
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary font-semibold hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
