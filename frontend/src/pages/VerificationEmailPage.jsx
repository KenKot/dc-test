import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";

export default function VerificationEmailPage() {
  const [value, setValue] = useState("");
  const { verifyEmail, isLoading, error } = useAuthStore();
  const { toast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    await verifyEmail(value);
    if (!error & !isLoading) {
      toast({
        title: "Email is verified!",
        description: "Your email has been successfully verified",
      });
      navigate("/login");
    }
  };

  return (
    <div className="space-y-2 flex flex-col w-full mx-auto justify-center">
      <InputOTP
        maxLength={5}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup className="mx-auto">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter your verification code</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>
      <Button onClick={handleSubmit}>Verify Email</Button>
    </div>
  );
}
