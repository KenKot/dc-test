import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../store/authStore";

const PrivateNavbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isModOrAdmin = user.role === "admin" || user.role === "moderator";

  return (
    <nav className="p-4 bg-slate-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="border border-red-500">
            Landing Page
          </Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profiles">Member Directory</Link>
          <Link to="/profile/edit">Edit My Profile</Link>
          {/* <Link to="/events">Events</Link> */}
          <Link to="/announcements">Announcements</Link>
        </div>

        {isModOrAdmin && (
          <div className="flex gap-4">
            <Button onClick={() => navigate("admin/permissions")}>
              Manage Permissions
            </Button>
            <Button onClick={() => navigate("admin/events")}>
              Manage Public Events
            </Button>
            <Button onClick={() => navigate("admin/announcements")}>
              Manage Announcements
            </Button>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* <Link to="/profile/edit"> */}
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-semibold text-gray-700">
              {user.firstname?.charAt(0)}
              {user.lastname?.charAt(0)}
            </div>
          )}
          {/* </Link> */}

          <Button onClick={logout}>Logout</Button>
        </div>
      </div>
    </nav>
  );
};

export default PrivateNavbar;
