import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/bcgw-logo.png";
import editIcon from "../assets/edit.svg";
import { useAuth } from "@/auth/AuthProvider";

const Header = () => {
  const { user } = useAuth()
  const name = user?.displayName ?? "";
  const initials = user?.displayName?.split(" ").map(s => s.charAt(0).toUpperCase()).join("") ?? "";
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center bg-bcgw-blue-dark text-bcgw-yellow-dark px-4 py-2 shadow-md">
      <div className="flex items-center gap-3">
        <img src={Logo} className="h-10" />
        <span className="font-semibold">BCGW Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-medium">Welcome, {name}</span>
        <div
          className="rounded-full bg-bcgw-yellow-dark text-bcgw-blue-dark font-semibold h-8 w-8 flex items-center justify-center hover:bg-[#9A762C] hover:cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => {
            navigate("/profile");
          }}
        >
          {hover ? <img className="h-5" src={editIcon} /> : initials}
        </div>
      </div>
    </header>
  );
};

export default Header;
