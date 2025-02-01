import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Lock, Info } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const { token } = useParams();
  const { resetPassword, isLoading, error, message } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    useAuthStore.setState({ error: null, message: null });
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");

    try {
      await resetPassword(token, password);
    } catch (err) {
      console.error("Reset Password Error:", err.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Password Input with Tooltip */}
            <div className="space-y-2 relative">
              <label htmlFor="password">New Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>

              {/* Password Tooltip */}
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
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Messages */}
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-500">{message}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || !password.trim() || !confirmPassword.trim()
              }
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="px-0"
            onClick={() => {
              useAuthStore.setState({ error: null, message: null });
              navigate("/login");
            }}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
