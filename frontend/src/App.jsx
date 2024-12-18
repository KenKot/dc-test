import { Navigate, Route, Routes, redirect, Outlet } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerificationEmailPage from "./pages/VerificationEmailPage";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Button } from "./components/ui/button";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PublicLayout from "./layouts/PublicLayout";
import PublicPage1 from "./pages/PublicPage1";
import PublicPage2 from "./pages/PublicPage2";
import AuthLayout from "./layouts/AuthLayout";
import WelcomePage from "./pages/WelcomePage";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  console.log(isAuthenticated, user, "<-- ProtectRoute");
  if (!isAuthenticated || !user) {
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

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/page1" element={<PublicPage1 />} />
        <Route path="/page2" element={<PublicPage2 />} />
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
      </Route>
    </Routes>
  );
};

// function App() {
//   const { isCheckingAuth, checkAuth, isAuthenticated, user, logout } =
//     useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   if (isCheckingAuth) {
//     return <div>Loading...</div>;
//   }

//   const handleLogout = async () => {
//     await logout();
//   };

//   return (
//     <div>
//       {user && <Button onClick={handleLogout}>Logout</Button>}
//       <Routes>
//         <Route path="/" element={"Home"} />
//         <Route
//           path="/signup"
//           element={
//             <AuthenticatedUserRoute>
//               <SignUpPage />
//             </AuthenticatedUserRoute>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <AuthenticatedUserRoute>
//               <LoginPage />
//             </AuthenticatedUserRoute>
//           }
//         />
//         <Route path="/verify-email" element={<VerificationEmailPage />} />
//         <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
//         <Route
//           path="/forgot-password"
//           element={
//             <AuthenticatedUserRoute>
//               <ForgotPasswordPage />
//             </AuthenticatedUserRoute>
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectRoute>
//               <DashboardPage />
//             </ProtectRoute>
//           }
//         />
//       </Routes>
//       <Toaster />
//     </div>
//   );
// }

export default App;
