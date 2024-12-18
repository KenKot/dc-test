import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "../components/ui/button";

const AuthLayout = () => {
  const { isCheckingAuth, checkAuth, isAuthenticated, user, logout } =
    useAuthStore();

  useEffect(() => {
    console.log("AuthLayout.jsx useEffect() fired");
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && <Button onClick={logout}>Logout</Button>}
      <Outlet />
      <Toaster />
    </div>
  );
};

export default AuthLayout;
