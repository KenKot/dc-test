import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="p-4 bg-slate-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="border border-gray-400 px-3 py-1 rounded">
            Home
          </Link>
          <Link
            to="/page1"
            className="border border-gray-400 px-3 py-1 rounded"
          >
            Contact Form Tester/Public Page 1
          </Link>
          <Link
            to="/public-events"
            className="border border-gray-400 px-3 py-1 rounded"
          >
            Public Events
          </Link>
        </div>
        <Link
          to="/login"
          className="border border-gray-500 px-4 py-2 rounded bg-white hover:bg-gray-100 transition"
        >
          myDChi Portal
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
