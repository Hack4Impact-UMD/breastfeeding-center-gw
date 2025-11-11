import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import primaryLogo from "../assets/bcgw-logo.png";
import home from "../assets/home.svg";
import logout from "../assets/logout.svg";
import clients from "../assets/clients.svg";
import management from "../assets/management.svg";
import service from "../assets/services.svg";
import LogoutConfirmation from "./NavigationBar/LogoutConfirmation";
import { createPortal } from "react-dom";

const MobileNavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [openLogoutConfirmation, setOpenLogoutConfirmation] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const activeStyle = "bg-bcgw-yellow-dark rounded-none -my-2 -mx-3 py-4 px-4";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-[#05182a] z-50 h-[60px]">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={primaryLogo}
              alt="BCGW Logo"
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* User initials - now clickable */}
          <button
            onClick={handleProfileClick}
            className="w-10 h-10 bg-bcgw-yellow-dark rounded-full flex items-center justify-center hover:bg-[#9A762C] active:bg-[#9A762C] transition-colors"
            aria-label="Go to profile"
          >
            <span className="text-[#05182a] font-bold text-sm">KL</span>
          </button>
        </div>
      </div>

      <div className="fixed top-[60px] left-0 right-0 z-40">
        {isOpen && (
          <div className="bg-white border-b border-gray-300">
            <div className="flex items-center justify-between px-4 py-2">
              {/* Navigation icons */}
              <div className="flex items-center gap-6">
                {/* Home icon */}
                <NavLink
                  to="/"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `p-2 rounded ${isActive ? activeStyle : ""}`
                  }
                >
                  <img className="w-[28px] h-[28px]" src={home} alt="Home" />
                </NavLink>

                {/* Services icon */}
                <button
                  onClick={handleServicesClick}
                  className={`p-2 rounded ${isServiceActive() ? activeStyle : ""}`}
                >
                  <img className="w-[28px] h-[28px]" src={service} alt="Services" />
                </button>

                {/* Clients icon */}
                <NavLink
                  to="/clients"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `p-2 rounded ${isActive ? activeStyle : ""}`
                  }
                >
                  <img className="w-[28px] h-[28px]" src={clients} alt="Clients" />
                </NavLink>

                {/* User Management icon */}
                <NavLink
                  to="/user-management"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `p-2 rounded ${isActive ? activeStyle : ""}`
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
              <button onClick={handleLogOut} className="p-2">
                <img className="w-[28px] h-[28px]" src={logout} alt="Logout" />
              </button>
            </div>

            {/* Services Dropdown */}
            {servicesOpen && (
              <div className="border-t border-gray-300">
                <NavLink
                  to="/services/jane"
                  className={({ isActive }) =>
                    `block px-6 py-3 text-base font-medium ${isActive ? "bg-bcgw-yellow-dark" : "bg-white hover:bg-gray-100"
                    }`
                  }
                >
                  Jane
                </NavLink>
                <NavLink
                  to="/services/acuity"
                  className={({ isActive }) =>
                    `block px-6 py-3 text-base font-medium ${isActive ? "bg-bcgw-yellow-dark" : "bg-white hover:bg-gray-100"
                    }`
                  }
                >
                  Acuity
                </NavLink>
                <NavLink
                  to="/services/paysimple"
                  className={({ isActive }) =>
                    `block px-6 py-3 text-base font-medium ${isActive ? "bg-bcgw-yellow-dark" : "bg-white hover:bg-gray-100"
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
            className="absolute left-0 bg-white border border-gray-300 border-t-0 rounded-b-lg px-3 py-1.5 flex flex-col items-center justify-center"
            aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          >
            {isOpen ? (
              <>
                <ChevronUp size={14} strokeWidth={3} className="-mb-1.5" />
                <ChevronUp size={14} strokeWidth={3} />
              </>
            ) : (
              <>
                <ChevronDown size={14} strokeWidth={3} className="-mb-1.5" />
                <ChevronDown size={14} strokeWidth={3} />
              </>
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
          document.body
        )}
    </>
  );
};

export default MobileNavigationBar;