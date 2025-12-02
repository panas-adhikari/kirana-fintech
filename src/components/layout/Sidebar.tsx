"use client";

import { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import { sidebarMenu } from "@/config/sidebar";
import { FaChevronLeft, FaChevronRight, FaQuestion } from "react-icons/fa";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Adjust sidebar state based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1080) {
        setCollapsed(true);
      } else {
        setCollapsed(false);  // Expand the sidebar if window width is >= 1080px
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`h-screen bg-white dark:bg-slate-900 border-r shadow-sm transition-all duration-300
      ${collapsed ? "w-16" : "w-55"} relative`}
    >
      {/* Sidebar Header: Logo & Workspace Name */}
      <div className="flex items-center p-4 dark:border-gray-700 mb-4">
          {/* Logo */}
        <div className="flex items-center justify-center rounded-full bg-green-500 p-1">
          <img
            src="#"  // Path to image logo
            alt="KiranaFinTech Logo"
            className="w-8 h-8 object-contain"
          />
        </div>

        {/* Title and Description */}
        {!collapsed &&(
          <div className="ml-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">KiranaFinTech_KIT</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Workspace</p>
        </div>
      )}
      </div>


      {/* Toggle Button for collapsing the sidebar */}
      {/* <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>  */}

      {/* Sidebar Menu */}
      <nav className="px-2">
        {sidebarMenu.map((item, index) => (
          <SidebarItem key={index} item={item} collapsed={collapsed} />
        ))}
      </nav>

       
      {/* New Help Section at the Bottom */}
      <div className="absolute bottom-2 left-1 w-full flex items-center justify-start p-3 dark:border-gray-700 hover:bg-gray-100 rounded-lg z-10">
        {/* Help Icon*/}
       <div className="flex items-center justify-center border-2 border-black rounded-full p-0.5">
        <FaQuestion className="text-black text-sm" />
      </div>

        {/* Help Text */}
        {!collapsed && (
          <div className="ml-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/help" className="text-blue-500 hover:underline">
              Help
            </Link>
          </p>
        </div>
        )}
      </div>
    </aside>
  );
}

