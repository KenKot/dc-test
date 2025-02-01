import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const { forgotPassword, isLoading, error, message } = useAuthStore();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setIsDisabled(true);

    try {
      await forgotPassword(trimmedEmail);
    } catch (err) {
      console.error("Forgot Password Error:", err.message);
      setIsDisabled(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isDisabled}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email.trim() || isDisabled}
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-500">{message}</p>}

        <Button
          variant="link"
          className="px-0"
          onClick={() => {
            setEmail("");
            setEmailError("");
            useAuthStore.setState({ error: null, message: null });
            navigate("/login");
          }}
        >
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}
