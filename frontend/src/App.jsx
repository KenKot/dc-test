import { Navigate, Route, Routes, redirect } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerificationEmailPage from "./pages/VerificationEmailPage";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Button } from "./components/ui/button";
import DashboardPage from "./pages/DashboardPage";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  // console.log("ProtectRoute: ", isAuthenticated, user);
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AuthenticatedUserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user, logout } =
    useAuthStore();

  useEffect(() => {
    checkAuth();
    // console.log("From App.jsx: ");
    // console.log("user: ", user);
    // console.log("isAuthenticated: ", isAuthenticated);
  }, [checkAuth]);

  // if (isCheckingAuth) {
  //   return <div>Loading...</div>;
  // }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      {user && <Button onClick={handleLogout}>Logout</Button>}
      <Routes>
        <Route path="/" element={"HOME"} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerificationEmailPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <DashboardPage />
            </ProtectRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
