import { LuCircleCheck } from "react-icons/lu";
import { Link, useLocation, Navigate } from "react-router-dom";
import Logo from "../assets/bcgw-logo2.png";

const LogoutPage = () => {
  const location = useLocation();
  if (!location.state?.fromApp) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-200">
      <img
        className="h-auto w-[clamp(280px,35vw,10000px)] object-contain m-0 p-0"
        src={Logo}
        alt="BCGW Logo"
      />
      <LuCircleCheck className="text-gray-500 w-[clamp(100px,12vw,10000px)] h-auto mb-[2vh]" />
      <h2 className="text-[max(15px,2vw)] font-semibold text-gray-800 mt-[12px]">
        You have been logged out.
      </h2>
      <Link
        to="/login"
        className="mt-[2vh] text-[max(12px,1.5vw)] text-gray-600 underline"
      >
        RETURN TO SIGN IN
      </Link>
    </div>
  );
};

export default LogoutPage;
