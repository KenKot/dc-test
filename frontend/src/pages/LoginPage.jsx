import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRememberMe, setIsRememberMe] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, isRememberMe);
    navigate("/dashboard");
  };

  const inputVariants = {
    focus: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign in to your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <motion.div whileFocus="focus" variants={inputVariants}>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <motion.div whileFocus="focus" variants={inputVariants}>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={isRememberMe}
              onChange={(e) => setIsRememberMe(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="rememberMe">Remember Me</Label>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </motion.div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="text-sm">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Reset Your Password
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
