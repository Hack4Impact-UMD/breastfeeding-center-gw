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
        className={`transition-all duration-200 ease-in-out bg-gray-100 min-h-screen overflow-x-hidden flex flex-col ml-0 ${
          navBarOpen ? "md:ml-[250px]" : "md:ml-[60px]"
        }`}
      >
        <span className="hidden md:block">
          <Header />
        </span>
        <div className="mt-14 md:mt-0 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
