import { NavLink } from "react-router";
import { useState } from "react";
import primaryLogo from "../assets/bcgw-logo.png";
import home from "../assets/home.svg";
import logout from "../assets/logout.svg";
import management from "../assets/management.svg";
import service from "../assets/services.svg";
import { LuChevronsLeft } from "react-icons/lu";
import { LuChevronsRight } from "react-icons/lu";

type NavigationBarProps = {
  open?: boolean;
};

const NavigationBar = (props: NavigationBarProps) => {
  // tailwind class styling into consts
  const notActiveStyle =
    "hover:bg-[#FFEAC1] bg-white w-[100%] h-[100%] p-3 flex items-center";
  const activeStyle = "bg-[#F5BB47] w-[100%] h-[100%] p-3 flex items-center";
  const activeIconStyle = "bg-[#F5BB47] w-[100%] h-[100%] p-4";
  const notActiveIconStyle = "";
  const categoryMargin = "ml-4";
  const serviceMargin = "ml-4"; //added this in case we want to change margin on service items but thought it looked ok with ml-4
  const serviceStyle =
    "flex flex-row w-[100%] h-[30px] border-t border-[#D9D9D9] cursor-pointer";
  const [openServices, setOpenServices] = useState(false);
  const [navBarOpen, setNavBarOpen] = useState(true);

  const toggleServicesDropdown = () => {
    setOpenServices(!openServices);
  };

  const toggleNavBar = () => {
    setNavBarOpen(!navBarOpen);
  };

  return (
    <div
      className={`flex flex-col justify-left h-screen bg-white fixed top-[0] left-[0] shadow-[4px_4px_4px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-200 ease-in-out ${
        navBarOpen ? "w-[250px]" : "w-[60px]"
      }`}
    >
      <div className="flex flex-row justify-between items-center p-4 pb-0">
        <button onClick={toggleNavBar} className="text-gray-600 flex ml-auto">
          {navBarOpen ? ( //nav bar open chevron
            <LuChevronsLeft className="w-6 h-6 cursor-pointer" />
          ) : (
            //nav bar closed chevron
            <LuChevronsRight className="w-6 h-6 cursor-pointer" />
          )}
        </button>
      </div>
      {navBarOpen ? ( //nav bar open content
        <div>
          <div className="flex flex-col items-center mb-2 pt-0 mt-0">
            <img
              className="flex w-[60%] object-contain"
              src={primaryLogo}
              alt="BCGW Logo"
            />
            <p className="font-semibold text-2xl text-[#F5BB47] pb-1">
              BCGW Data Portal
            </p>
          </div>

          {/*HOME*/}
          <div className="flex flex-col items-center mt-5 border-x border-[#D9D9D9] divide-y-1 divide-[#D9D9D9]">
            <div className="flex flex-row border-t border-[#D9D9D9] w-[100%] cursor-pointer">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeStyle : notActiveStyle
                }
              >
                <img className="w-[30px] h-[30px]" src={home} />
                <span className={categoryMargin}>Home</span>
              </NavLink>
            </div>

            {/*SERVICES*/}
            <div className="flex flex-row w-[100%] cursor-pointer">
              <NavLink
                to="/test2"
                className={({ isActive }) =>
                  isActive ? activeStyle : notActiveStyle
                }
                onClick={(e) => {
                  e.preventDefault();
                  toggleServicesDropdown();
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <img className="w-[30px] h-[30px]" src={service} />
                    <span className={categoryMargin}>Services</span>
                  </div>
                  <span className="text-black-500">▼</span>{" "}
                  {/* Dropdown triangle */}
                </div>
              </NavLink>
            </div>

            {/*SERVICES DROPDOWN*/}
            {openServices && ( //dropdown open
              <div className="w-full bg-white shadow-lg z-1">
                <div className={`${serviceStyle} border-t-0`}>
                  <NavLink
                    to="/testService"
                    className={({ isActive }) =>
                      isActive ? activeStyle : notActiveStyle
                    }
                  >
                    <span className={serviceMargin}>Milk Depo</span>
                  </NavLink>
                </div>
                <div className={serviceStyle}>
                  <NavLink
                    to="/testService2"
                    className={({ isActive }) =>
                      isActive ? activeStyle : notActiveStyle
                    }
                  >
                    <span className={serviceMargin}>Group Classes</span>
                  </NavLink>
                </div>
                <div className={serviceStyle}>
                  <NavLink
                    to="/testService2"
                    className={({ isActive }) =>
                      isActive ? activeStyle : notActiveStyle
                    }
                  >
                    <span className={serviceMargin}>Rentals</span>
                  </NavLink>
                </div>
                <div className={serviceStyle}>
                  <NavLink
                    to="/testService2"
                    className={({ isActive }) =>
                      isActive ? activeStyle : notActiveStyle
                    }
                  >
                    <span className={serviceMargin}>Consultations</span>
                  </NavLink>
                </div>
                <div className={serviceStyle}>
                  <NavLink
                    to="/testService2"
                    className={({ isActive }) =>
                      isActive ? activeStyle : notActiveStyle
                    }
                  >
                    <span className={serviceMargin}>Mailchimp</span>
                  </NavLink>
                </div>
                <div className={serviceStyle}>
                  <NavLink
                    to="/testService2"
                    className={({ isActive }) =>
                      isActive ? activeStyle : notActiveStyle
                    }
                  >
                    <span className={serviceMargin}>Donations</span>
                  </NavLink>
                </div>
              </div>
            )}

            {/*USER MANAGEMENT*/}
            <div className="flex flex-row border-b border-[#D9D9D9] w-[100%] cursor-pointer">
              <NavLink
                to="/test3"
                className={({ isActive }) =>
                  isActive ? activeStyle : notActiveStyle
                }
              >
                <img className="w-[30px] h-[30px]" src={management} />
                <span className={categoryMargin}>Edit Volunteers</span>
              </NavLink>
            </div>
          </div>

          {/*LOGOUT*/}
          <div className="absolute bottom-[20px] left-[25px] flex justify-left">
            <img src={logout} className="w-[30px] h-[30px]" />
            <button className="ml-4" onClick={() => {}}>
              LOG OUT
            </button>
          </div>
        </div>
      ) : (
        //nav bar closed content
        <div className="flex flex-col items-center mb-2 h-full justify-between">
          <div className="flex flex-col items-center space-y-7 pt-40">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? activeIconStyle : notActiveIconStyle
              }
            >
              <img className="w-[30px] h-[30px]" src={home} />
            </NavLink>
            <img className="w-[30px] h-[30px]" src={service} />
            <NavLink
              to="/test3"
              className={({ isActive }) =>
                isActive ? activeIconStyle : notActiveIconStyle
              }
            >
              <img className="w-[30px] h-[30px]" src={management} />
            </NavLink>
          </div>

          <div className="mt-auto">
            <img src={logout} className="w-[30px] h-[30px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
