import { Navigate, Route, Routes, redirect, Outlet } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerificationEmailPage from "./pages/VerificationEmailPage";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Button } from "./components/ui/button";
import DashboardPage from "./pages/private/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PublicLayout from "./layouts/PublicLayout";
import PublicPage1 from "./pages/PublicPage1";
import PublicPage2 from "./pages/PublicPage2";
import AuthLayout from "./layouts/AuthLayout";
import WelcomePage from "./pages/WelcomePage";
import AccountApprovalPending from "./pages/AccountApprovalPending";
import AccountDeactivatedPage from "./pages/AccountDeactivatedPage";
import ProfilesPage from "./pages/private/ProfilesPage";
import ProfilePage from "./pages/private/ProfilePage";
import AdminDashboardPage from "./pages/private/AdminDashboardPage";

//Not logged in? You can't go to the protected routes
const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  console.log(isAuthenticated, user, "<-- ProtectRoute");
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  //user.role == "pending" ? go to pending page
  if (user.role === "pending") {
    return <Navigate to="/account-pending" replace />;
  }
  //user.role == "banned" ? go to deactivated page
  if (user.role === "banned") {
    return <Navigate to="/account-deactivated" replace />;
  }

  return children;
};

//Only Admins/Mods can go to AdminDashboard
const ProtectAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Check if the user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if the user has a restricted role
  if (user.role === "pending") {
    return <Navigate to="/account-pending" replace />;
  }

  if (user.role === "banned") {
    return <Navigate to="/account-deactivated" replace />;
  }

  // Check if the user has an admin or moderator role
  if (user.role !== "admin" && user.role !== "moderator") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

//logged in user shouldnt go to "signup/verifypassword/forgotpassword/login",
// take them to /dashboard instead
const AuthenticatedUserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/page1" element={<PublicPage1 />} />
        <Route path="/page2" element={<PublicPage2 />} />
        <Route path="/account-pending" element={<AccountApprovalPending />} />
        <Route
          path="/account-deactivated"
          element={<AccountDeactivatedPage />}
        />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/signup"
          element={
            <AuthenticatedUserRoute>
              <SignUpPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthenticatedUserRoute>
              <LoginPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route path="/verify-email" element={<VerificationEmailPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/forgot-password"
          element={
            <AuthenticatedUserRoute>
              <ForgotPasswordPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <DashboardPage />
            </ProtectRoute>
          }
        />
        <Route
          path="/profiles"
          element={
            <ProtectRoute>
              <ProfilesPage />
            </ProtectRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectRoute>
              <ProfilePage />
            </ProtectRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectAdminRoute>
              <AdminDashboardPage />
            </ProtectAdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};
export default App;
