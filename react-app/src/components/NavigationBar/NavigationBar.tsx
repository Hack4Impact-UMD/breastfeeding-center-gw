import { NavLink } from "react-router";
import { useState } from "react";
import primaryLogo from "../../assets/bcgw-logo.png";
import home from "../../assets/home.svg";
import logout from "../../assets/logout.svg";
import management from "../../assets/management.svg";
import service from "../../assets/services.svg";
import { LuChevronsLeft } from "react-icons/lu";
import { LuChevronsRight } from "react-icons/lu";
import LogoutConfirmation from "./LogoutConfirmation";

const NavigationBar = () => {
  // tailwind class styling into consts
  const notActiveStyle =
    "hover:bg-bcgw-yellow-light bg-white w-full h-full p-3 flex items-center";
  const activeStyle = "bg-bcgw-yellow-dark w-full h-full p-3 flex items-center";
  const activeIconStyle = "bg-bcgw-yellow-dark w-full p-4";
  const notActiveIconStyle = "p-4";
  const categoryMargin = "ml-4";
  const serviceMargin = "ml-12";
  const serviceStyle = "flex flex-row w-full h-[30px] cursor-pointer";
  const [openServices, setOpenServices] = useState(false);
  const [navBarOpen, setNavBarOpen] = useState(true);
  const [openLogoutConfirmation, setOpenLogoutConfirmation] =
    useState<boolean>(false);

  const toggleServicesDropdown = () => {
    setOpenServices(!openServices);
  };

  const toggleNavBar = () => {
    setNavBarOpen(!navBarOpen);
  };

  const handleLogOut = (): void => {
    setOpenLogoutConfirmation(true);
  };

  return (
    <div
      className={`flex flex-col justify-left h-screen fixed shadow-[4px_4px_4px_0px_rgba(0,_0,_0,_0.25)] transition-all duration-200 ease-in-out ${
        navBarOpen ? "w-[250px]" : "w-[60px]"
      }`}>
      <div className="flex flex-col h-full ">
        <div className="flex flex-row justify-between items-center pr-3 pt-1">
          <button onClick={toggleNavBar} className="flex ml-auto">
            {navBarOpen ? ( //nav bar open chevron
              <LuChevronsLeft
                className="w-8 h-8 cursor-pointer"
                color="var(--color-bcgw-blue-dark)"
              />
            ) : (
              //nav bar closed chevron
              <LuChevronsRight
                className="w-8 h-8 cursor-pointer"
                color="var(--color-bcgw-blue-dark)"
              />
            )}
          </button>
        </div>
        {navBarOpen ? ( //nav bar open content
          <>
            <div className="flex flex-col items-center pt-0">
              <img
                className="flex w-[40%] object-contain -mt-6"
                src={primaryLogo}
                alt="BCGW Logo"
              />
              <p className="font-semibold text-2xl text-bcgw-blue-dark pb-1">
                Dashboard
              </p>
            </div>

            {/*HOME*/}
            <div className="flex flex-col items-center mt-5 border-x border-bcgw-gray-light divide-y-1 divide-bcgw-gray-light overflow-y-auto">
              <div className="flex flex-row border-t border-bcgw-gray-light w-full cursor-pointer">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? activeStyle : notActiveStyle
                  }>
                  <img className="w-[30px] h-[30px] " src={home} />
                  <span className={categoryMargin}>Home</span>
                </NavLink>
              </div>

              {/*SERVICES*/}
              <div className="flex flex-row w-full cursor-pointer">
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    isActive ? activeStyle : notActiveStyle
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    toggleServicesDropdown();
                  }}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <img className="w-[30px] h-[30px]" src={service} />
                      <span className={categoryMargin}>Services</span>
                    </div>
                    {/* Dropdown triangle */}
                    {openServices ? (
                      <span className="text-bcgw-blue-dark">▲</span>
                    ) : (
                      <span className="text-bcgw-blue-dark">▼</span>
                    )}
                  </div>
                </NavLink>
              </div>

              {/*SERVICES DROPDOWN*/}
              {openServices && ( //dropdown open
                <div className="w-full">
                  <div className={`${serviceStyle} border-t-0`}>
                    <NavLink
                      to="/services/jane"
                      className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                      }>
                      <span className={serviceMargin}>JANE</span>
                    </NavLink>
                  </div>
                  <div className={serviceStyle}>
                    <NavLink
                      to="/services/acuity"
                      className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                      }>
                      <span className={serviceMargin}>Acuity</span>
                    </NavLink>
                  </div>
                  <div className={serviceStyle}>
                    <NavLink
                      to="/services/paysimple"
                      className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                      }>
                      <span className={serviceMargin}>PaySimple</span>
                    </NavLink>
                  </div>
                  <div className={serviceStyle}>
                    <NavLink
                      to="/services/milkdepot"
                      className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                      }>
                      <span className={serviceMargin}>Milk Depot</span>
                    </NavLink>
                  </div>
                  <div className={serviceStyle}>
                    <NavLink
                      to="/services/mailchimp"
                      className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                      }>
                      <span className={serviceMargin}>Mailchimp</span>
                    </NavLink>
                  </div>
                  <div className={serviceStyle}>
                    <NavLink
                      to="/services/paypal"
                      className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                      }>
                      <span className={serviceMargin}>Paypal</span>
                    </NavLink>
                  </div>
                </div>
              )}

              {/*USER MANAGEMENT*/}
              <div className="flex flex-row border-b border-bcgw-gray-light w-full cursor-pointer">
                <NavLink
                  to="/management"
                  className={({ isActive }) =>
                    isActive ? activeStyle : notActiveStyle
                  }>
                  <img className="w-[30px] h-[30px]" src={management} />
                  <span className={categoryMargin}>User Management</span>
                </NavLink>
              </div>
            </div>

            {/*LOGOUT*/}
            <div className="flex-grow"></div>
            <div className="sticky bottom-0 py-4 border-t border-bcgw-gray-light">
              <button
                className="flex justify-left items-center text-bcgw-blue-dark pl-3 gap-3 underline cursor-pointer "
                onClick={() => {
                  handleLogOut();
                }}>
                <img src={logout} className="w-[30px] h-[30px]" />
                LOGOUT
              </button>
            </div>
          </>
        ) : (
          //nav bar closed content
          <div className="flex flex-col items-center justify-between mb-2 h-full">
            <div className="flex flex-col items-center justify-center space-y-5 h-full">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeIconStyle : notActiveIconStyle
                }>
                <img className="w-[30px] h-[30px]" src={home} />
              </NavLink>

              <NavLink
                to="/services"
                className={({ isActive }) =>
                  isActive ? activeIconStyle : notActiveIconStyle
                }
                onClick={(e) => {
                  e.preventDefault();
                  toggleNavBar();
                  setOpenServices(true);
                }}>
                <img className="w-[30px] h-[30px]" src={service} />
              </NavLink>

              <NavLink
                to="/management"
                className={({ isActive }) =>
                  isActive ? activeIconStyle : notActiveIconStyle
                }>
                <img className="w-[30px] h-[30px]" src={management} />
              </NavLink>
            </div>

            <button
              className="mt-auto hover:cursor-pointer"
              onClick={() => {
                handleLogOut();
              }}>
              <img src={logout} className="w-[30px] h-[30px]" />
            </button>
          </div>
        )}
      </div>
      <LogoutConfirmation
        open={openLogoutConfirmation}
        onClose={setOpenLogoutConfirmation}
      />
    </div>
  );
};

export default NavigationBar;
