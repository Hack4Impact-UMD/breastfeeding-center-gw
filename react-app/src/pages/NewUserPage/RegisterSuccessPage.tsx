import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function RegisterSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-white">
      <img src="/bcgw-logo2.png" alt="logo2 alternate text" className="w-20 mb-2" />
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center">
            <CheckCircle size={100} color="#666" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Thanks for registering!</h2>
        <button
          className="mt-4 underline text-gray-700 hover:text-yellow-600"
          onClick={() => navigate("/login")}
        >
          TO SIGN IN
        </button>
      </div>
    </div>
  );
}