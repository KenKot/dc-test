import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountApprovalPending = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-lg text-center mb-4">
        Hello! Your account is awaiting activation. You will receive an email
        when it's approved.
      </h1>
      {user && (
        <Button onClick={logout} className="mt-4">
          Logout
        </Button>
      )}
    </div>
  );
};

export default AccountApprovalPending;
