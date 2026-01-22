import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import MobileNavigationBar from "@/components/MobileNavigationBar";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Outlet } from "react-router";
export default function LayoutShell() {
  const [navBarOpen, setNavBarOpen] = useState(true);

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
        className={`w-full transition-all duration-200 ease-in-out bg-gray-100 min-h-screen overflow-x-hidden flex flex-col pl-0 ${navBarOpen ? "md:pl-[250px]" : "md:pl-[60px]"
          }`}
      >
        <div className={`z-50 hidden md:block fixed top-0 right-0 ${navBarOpen ? "left-[250px]" : "left-[60px]"}`}>
          <Header />
        </div>
        <div className="pt-14 md:mt-0 h-full flex flex-col items-center">
          <div className="w-full max-w-7xl px-4 md:px-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
