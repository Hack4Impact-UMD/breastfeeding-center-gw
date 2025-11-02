import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { useState } from "react";
import { Outlet } from "react-router";

export default function LayoutShell() {
  const [navBarOpen, setNavBarOpen] = useState(true);

  return (
    <div className="w-full h-full">
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-100 min-h-screen overflow-x-hidden flex flex-col ${
          navBarOpen ? "ml-[250px]" : "ml-[60px]"
        }`}
      >
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
