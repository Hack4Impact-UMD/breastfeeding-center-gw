import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import primaryLogo from "../assets/bcgw-logo.png";
import home from "../assets/home.svg";
import logout from "../assets/logout.svg";
import clients from "../assets/clients.svg";
import management from "../assets/management.svg";
import service from "../assets/services.svg";
import LogoutConfirmation from "./NavigationBar/LogoutConfirmation";
import { createPortal } from "react-dom";
import { useAuth } from "@/auth/AuthProvider";

const MobileNavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [openLogoutConfirmation, setOpenLogoutConfirmation] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile: user } = useAuth();
  const initials =
    (user?.firstName.charAt(0).toUpperCase() ?? "") +
    (user?.lastName.charAt(0).toUpperCase() ?? "");

  // Auto-collapse on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
        setServicesOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (!newIsOpen) {
      setServicesOpen(false);
    }
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setServicesOpen(!servicesOpen);
  };

  const handleNavClick = () => {
    // Close services dropdown when clicking other nav items
    setServicesOpen(false);
  };

  const handleLogOut = () => {
    setOpenLogoutConfirmation(true);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Check if any service page is active
  const isServiceActive = () => {
    return (
      location.pathname.includes("/services/jane") ||
      location.pathname.includes("/services/acuity") ||
      location.pathname.includes("/services/paysimple")
    );
  };

  const activeStyle = "bg-bcgw-yellow-dark rounded-none";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-bcgw-blue-dark text-bcgw-yellow-dark pr-2 z-40 h-[60px] shadow-md">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={primaryLogo}
              alt="BCGW Logo"
              className="w-14 h-14 object-contain"
            />
          </div>

          {/* User initials */}
          <button
            onClick={handleProfileClick}
            className="rounded-full bg-bcgw-yellow-dark text-bcgw-blue-dark font-semibold h-10 w-10 flex items-center justify-center hover:bg-[#9A762C] hover:cursor-pointer"
            aria-label="Go to profile"
          >
            {initials}
          </button>
        </div>
      </div>

      <div className="fixed top-[60px] left-0 right-0 z-40">
        {isOpen && (
          <div className="bg-white border-b border-gray-300">
            <div className="flex items-center justify-between">
              {/* Navigation icons */}
              <div className="flex items-center">
                {/* Home icon */}
                <NavLink
                  to="/"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `p-3 rounded ${isActive ? activeStyle : ""}`
                  }
                >
                  <img className="w-[28px] h-[28px]" src={home} alt="Home" />
                </NavLink>

                {/* Services icon */}
                <button
                  onClick={handleServicesClick}
                  className={`p-3 rounded ${isServiceActive() ? activeStyle : ""}`}
                >
                  <img
                    className="w-[28px] h-[28px]"
                    src={service}
                    alt="Services"
                  />
                </button>

                {/* Clients icon */}
                <NavLink
                  to="/clients"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `p-3 rounded ${isActive ? activeStyle : ""}`
                  }
                >
                  <img
                    className="w-[28px] h-[28px]"
                    src={clients}
                    alt="Clients"
                  />
                </NavLink>

                {/* User Management icon */}
                <NavLink
                  to="/user-management"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `p-3 rounded ${isActive ? activeStyle : ""}`
                  }
                >
                  <img
                    className="w-[28px] h-[28px]"
                    src={management}
                    alt="User Management"
                  />
                </NavLink>
              </div>

              {/* Logout icon */}
              <button onClick={handleLogOut} className="p-3">
                <img className="w-[28px] h-[28px]" src={logout} alt="Logout" />
              </button>
            </div>

            {/* Services Dropdown */}
            {servicesOpen && (
              <div className="border-t border-gray-300">
                <NavLink
                  to="/services/jane"
                  className={({ isActive }) =>
                    `block px-6 py-3 text-base font-medium ${
                      isActive
                        ? "bg-bcgw-yellow-dark"
                        : "bg-white hover:bg-bcgw-yellow-light"
                    }`
                  }
                >
                  Jane
                </NavLink>
                <NavLink
                  to="/services/acuity"
                  className={({ isActive }) =>
                    `block px-6 py-3 text-base font-medium ${
                      isActive
                        ? "bg-bcgw-yellow-dark"
                        : "bg-white hover:bg-bcgw-yellow-light"
                    }`
                  }
                >
                  Acuity
                </NavLink>
                <NavLink
                  to="/services/paysimple"
                  className={({ isActive }) =>
                    `block px-6 py-3 text-base font-medium ${
                      isActive
                        ? "bg-bcgw-yellow-dark"
                        : "bg-white hover:bg-bcgw-yellow-light"
                    }`
                  }
                >
                  Paysimple
                </NavLink>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <button
            onClick={handleToggle}
            className="absolute left-0 bg-white border border-gray-300 border-t-0 rounded-b-lg px-3 py-1.5"
            aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          >
            {isOpen ? (
              <ChevronsUp size={16} strokeWidth={3} />
            ) : (
              <ChevronsDown size={16} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {openLogoutConfirmation &&
        createPortal(
          <LogoutConfirmation
            open={openLogoutConfirmation}
            onClose={() => setOpenLogoutConfirmation(false)}
          />,
          document.body,
        )}
    </>
  );
};

export default MobileNavigationBar;
