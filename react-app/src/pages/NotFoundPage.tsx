import { Link } from "react-router-dom";
import primaryLogo from "../assets/bcgw-logo.png";

function NotFoundPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-2">
        <img
          className="h-50 w-50 object-contain"
          src={primaryLogo}
          alt="BCGW Logo"
        />
        <p className="text-8xl font-extrabold tracking-[8px]">404</p>
        <h2 className="font-semibold tracking-[2px]">Oops! Page Not Found</h2>
        <h3>The page you are looking for is unavailable or missing.</h3>
        <Link to="/">
          <p className="underline mt-2">RETURN TO HOME</p>
        </Link>
      </div>
    </>
  );
}

export default NotFoundPage;
