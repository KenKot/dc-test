import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function VerificationEmailPage() {
  const [value, setValue] = useState("");
  const { verifyEmail, isLoading, error } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (value.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      await verifyEmail(value);
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Verification Failed",
        description: err.message || "Invalid verification code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-xl font-semibold mb-4">
          An email with the verification code has been sent!
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          If you don't see it, check your spam folder.
        </p>

        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          inputMode="text"
        >
          <InputOTPGroup className="flex justify-center gap-2 mb-3">
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-10 h-12 text-lg"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                inputMode="text"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <p className="text-sm text-gray-500 mb-4">
          {value === ""
            ? "Enter your verification code"
            : `You entered: ${value}`}
        </p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full text-white font-medium"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </div>
    </div>
  );
}
