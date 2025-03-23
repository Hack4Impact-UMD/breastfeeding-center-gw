import { NavLink } from "react-router";
import { useState } from "react";
import primaryLogo from "../assets/bcgw-logo.png";
import home from "../assets/home.svg";
import logout from "../assets/logout.svg"
import management from "../assets/management.svg"
import service from "../assets/services.svg"


type NavigationBarProps = {
  open?: boolean;
};

const NavigationBar = (props: NavigationBarProps) => {
  // tailwind class styling into consts 
  const notActiveStyle = "hover:bg-[#FFEAC1] bg-white w-[100%] h-[100%] p-3 flex items-center";
  const activeStyle = "bg-[#F5BB47] w-[100%] h-[100%] p-3 flex items-center";
  const categoryMargin = "ml-4";
  
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
              isActive ? activeStyle : notActiveStyle
            }
          >
            <img className="w-[30px] h-[30px]" src={home}/>
            <span className={categoryMargin}>Home</span>
          </NavLink>
        </div>
        <div className="flex flex-row w-[100%] cursor-pointer">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeStyle : notActiveStyle
            }
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <img className="w-[30px] h-[30px]" src={service} />
                <span className={categoryMargin}>Services</span>
              </div>
              <span className="text-black-500">▼</span> {/* Dropdown triangle */}
            </div>
          </NavLink>
        </div>
        <div className="flex flex-row border-b border-[#D9D9D9] w-[100%] cursor-pointer">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive? activeStyle : notActiveStyle
            }
          >
            <img  className="w-[30px] h-[30px]" src={management}/>
            <span className={categoryMargin}>User Management</span>
          </NavLink>
        </div>
      </div>
      <div className="absolute bottom-[20px] left-[25px] flex justify-left">
      <img src={logout} className="w-[30px] h-[30px]"/>
        <button className="ml-4" onClick={() => {}}>LOG OUT</button>
      </div>
    </div>
  );
};

export default NavigationBar;
