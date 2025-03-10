import { Link } from "react-router-dom";
import primaryLogo from "../assets/bcgw-logo.png";

function NotFoundPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-2 p-2">
        <img
          className="h-50 w-50 object-contain"
          src={primaryLogo}
          alt="BCGW Logo"
        />
        <p className="text-8xl font-extrabold font-[Roboto] tracking-[8px]">
          404
        </p>
        <h2 className="font-[Roboto] font-semibold tracking-[2px]">
          Oops! Page Not Found
        </h2>
        <h3 className="font-Inter">
          The page you are looking for is unavailable or missing.
        </h3>
        <Link to="/">
          <p className="font-Inter underline text-[#3a3a3a]">RETURN TO HOME</p>
        </Link>
      </div>
    </>
  );
}

export default NotFoundPage;
