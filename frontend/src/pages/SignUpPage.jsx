import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

// Helper function to format names in Title Case
const formatTitleCase = (name) => {
  return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function SignUpPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      await signup(firstname, lastname, email, password);
      navigate("/verify-email");
    } catch (error) {
      console.error("Signup failed:", error);
    }
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
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <motion.div whileFocus="focus" variants={inputVariants}>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="firstname"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstname}
                  onChange={(e) =>
                    setFirstname(formatTitleCase(e.target.value))
                  }
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <motion.div whileFocus="focus" variants={inputVariants}>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastname}
                  onChange={(e) => setLastname(formatTitleCase(e.target.value))}
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>
          </div>

          {/* Email */}
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
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
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
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>

            {/* Tooltip - Appears when focusing on the password field */}
            {showTooltip && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white text-gray-700 text-sm p-3 border border-gray-300 rounded shadow-lg z-10">
                <p className="font-semibold flex items-center">
                  <Info className="w-4 h-4 mr-1" /> Password must contain:
                </p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>At least 8 characters</li>
                  <li>One lowercase letter</li>
                  <li>One uppercase letter</li>
                  <li>One number</li>
                  <li>One special symbol</li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <motion.div whileFocus="focus" variants={inputVariants}>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>
          </div>

          {/* Error Messages */}
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
