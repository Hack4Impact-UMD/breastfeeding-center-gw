import { LuCircleCheck } from "react-icons/lu";
import { Link, useLocation, Navigate } from "react-router-dom";
import Logo from "../assets/bcgw-logo2.png";

const LogoutPage = () => {
  const location = useLocation();
  if (!location.state?.fromApp) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        className="h-50 w-80 object-contain m-0 p-0"
        src={Logo}
        alt="BCGW Logo"
      />

      <LuCircleCheck className="text-gray-500 w-38 h-38 mb-4" />

      <h2 className="text-xl font-semibold text-gray-800 mt-[12px]">
        You have been logged out.
      </h2>

      <Link to="/login" className="mt-4 text-sm text-gray-600 underline">
        RETURN TO SIGN IN
      </Link>
    </div>
  );
};

export default LogoutPage;
