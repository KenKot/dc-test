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
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profiles">Member Directory</Link>
          <Link to="/profile/edit">Edit My Profile</Link>
          <Link to="/events">Events</Link>
          <Link to="/announcements">Announcements</Link>
        </div>

        {isModOrAdmin && (
          <div className="flex gap-4">
            <Button onClick={() => navigate("admin/permissions")}>
              Manage Permissions
            </Button>
            <Button onClick={() => navigate("admin/events")}>
              Manage Events
            </Button>
            <Button onClick={() => navigate("admin/announcements")}>
              Manage Announcements
            </Button>
          </div>
        )}
        {<Button onClick={logout}>Logout</Button>}
      </div>
    </nav>
  );
};

export default PrivateNavbar;
