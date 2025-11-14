import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import MobileNavigationBar from "@/components/MobileNavigationBar";
import { useState } from "react";
import { Outlet } from "react-router";
export default function LayoutShell() {
  const [navBarOpen, setNavBarOpen] = useState(true);

  return (
    <div className="w-full h-full">
      {/* Desktop navbar - hidden on mobile (sm breakpoint) */}
      <div className="hidden sm:block">
        <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      </div>

      {/* Mobile navbar - shown only on mobile */}
      <div className="block sm:hidden">
        <MobileNavigationBar />
      </div>

      <div
        className={`transition-all duration-200 ease-in-out bg-gray-100 min-h-screen overflow-x-hidden flex flex-col ml-0 ${
          navBarOpen ? "sm:ml-[250px]" : "sm:ml-[60px]"
        }`}
      >
        <span className="hidden sm:block">
          <Header />
        </span>
        <div className="mt-14 sm:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
