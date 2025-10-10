import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Logo from "../../assets/bcgw-logo2.png";

export default function RegisterSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-white px-4">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-16">
        <img src={Logo} alt="BCGW Logo" className="w-96 mb-4" />
      </div>

      {/* Success Icon */}
      <div className="flex justify-center items-center mb-8">
        <CheckCircle size={120} color="#666" strokeWidth={1.5} />
      </div>

      {/* Text Section */}
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">Thanks for registering!</h2>
        <button
          className="text-lg text-gray-500 hover:text-yellow-600 underline uppercase tracking-wide"
          onClick={() => navigate("/login")}
        >
          TO SIGN IN
        </button>
      </div>
    </div>
  );
}
