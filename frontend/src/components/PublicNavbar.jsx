import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="p-4 bg-slate-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/page1">Public Page 1</Link>
          <Link to="/page2">Public Page 2</Link>
        </div>
        <Link to="/login" className="btn">
          myDChi Portal
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
