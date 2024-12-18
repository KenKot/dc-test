import PublicNavbar from "@/components/PublicNavbar";
import { Outlet } from "react-router-dom";

const PublicLayout = ({ children }) => {
  console.log("PublicLayout.jsx fired");
  return (
    <div>
      <PublicNavbar />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
