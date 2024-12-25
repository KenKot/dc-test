import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to={"/"}>
        <h2 className="text-red-500">Click here to return to the home page.</h2>
      </Link>
    </div>
  );
};

export default NotFoundPage;
