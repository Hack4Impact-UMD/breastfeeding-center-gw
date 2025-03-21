import { NavLink } from "react-router";
import primaryLogo from "../assets/bcgw-logo.png";

type NavigationBarProps = {
  open?: boolean;
};

const NavigationBar = (props: NavigationBarProps) => {
  return (
    <div className="flex flex-col justify-left w-[250px] h-screen bg-white fixed top-[0] left-[0] shadow-[4px_4px_4px_0px_rgba(0,_0,_0,_0.25)]">
      <div className="flex flex-col items-center mb-2">
        <img
          className="flex w-[60%] object-contain"
          src={primaryLogo}
          alt="BCGW Logo"
        />
        <p className="font-semibold text-2xl">Dashboard</p>
      </div>
      <div className="flex flex-col items-center mt-5 border-x border-[#D9D9D9] divide-y-1 divide-[#D9D9D9]">
        <div className="flex flex-row border-t border-[#D9D9D9] w-[100%] cursor-pointer">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "bg-[#F5BB47] w-[100%] h-[100%] p-3" : "bg-white p-3"
            }
          >
            Home
          </NavLink>
        </div>
        <div className="flex flex-row w-[100%] cursor-pointer">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "bg-[#F5BB47] w-[100%] h-[100%] p-3" : "bg-white p-3"
            }
          >
            Services
          </NavLink>
        </div>
        <div className="flex flex-row border-b border-[#D9D9D9] w-[100%] cursor-pointer">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "bg-[#F5BB47] w-[100%] h-[100%] p-3" : "bg-white p-3"
            }
          >
            User Management
          </NavLink>
        </div>
      </div>
      <div className="absolute bottom-[20px] left-[25px] flex justify-left">
        <button onClick={() => {}}>LOG OUT</button>
      </div>
    </div>
  );
};

export default NavigationBar;
