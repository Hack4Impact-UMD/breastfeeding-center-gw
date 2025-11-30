import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import MobileNavigationBar from "@/components/MobileNavigationBar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import { Outlet } from "react-router";
export default function LayoutShell() {
  const [navBarOpen, setNavBarOpen] = useState(true);

  const CloseButton = ({ closeToast }: any) => (
    <IoIosClose 
      onClick={closeToast}
      className="text-white cursor-pointer"
      size={28}
    />
  );

  return (
    <div className="w-full h-full">
      {/* Desktop navbar - hidden on mobile (sm breakpoint) */}
      <div className="hidden md:block">
        <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      </div>

      {/* Mobile navbar - shown only on mobile */}
      <div className="block md:hidden">
        <MobileNavigationBar />
      </div>

      <div
        className={`transition-all duration-200 ease-in-out bg-gray-100 min-h-screen overflow-x-hidden flex flex-col ml-0 ${
          navBarOpen ? "md:ml-[250px]" : "md:ml-[60px]"
        }`}
      >
        <span className="hidden md:block">
          <Header />
        </span>
        <div className="mt-14 md:mt-0">
          <Outlet />
        </div>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        closeButton={CloseButton}
        icon={false} 
      />
      
      <style>{`
        .Toastify__toast {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          border-radius: 0.75rem;
          padding: 16px 20px;
          min-height: 64px;
          min-width: 400px;
          background-color: #1e293b !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .Toastify__toast--success {
          background-color: #1e293b !important;
        }
        
        .Toastify__toast--warning {
          background-color: #1e293b !important;
        }
        
        .Toastify__toast--error {
          background-color: #1e293b !important;
        }
        
        .Toastify__toast-body {
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          font-size: 40px !important;
          font-weight: 400 !important;
          color: #ffffff !important;
          flex: 1 !important;
        }
        
        .Toastify__toast-body > div {
          font-size: 40px !important;
        }
        
        .Toastify__toast-body span {
          font-size: 40px !important;
        }
        
        .Toastify__close-button {
          opacity: 0.7 !important;
          align-self: center !important;
          padding: 0 !important;
          margin-left: 16px !important;
          flex-shrink: 0 !important;
        }
        
        .Toastify__close-button:hover {
          opacity: 1 !important;
        }
        
        .Toastify__close-button > svg {
          height: 28px !important;
          width: 28px !important;
        }
        
        .Toastify__toast-icon {
          width: 24px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}