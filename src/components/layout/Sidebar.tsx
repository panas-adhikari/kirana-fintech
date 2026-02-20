"use client";

import { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import { sidebarMenu } from "@/config/sidebar";
import { FaQuestionCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Store, Users } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { profile } = useAuthStore();

  const storeName = profile?.branch?.store?.name || "KiranaFinTech";
  const branchName = profile?.branch?.name || "Workspace";
  const isManager = profile?.role === 'admin' || profile?.role === 'owner' || profile?.role === 'manager';

  // Adjust sidebar state based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1080) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 relative ${collapsed ? "w-16" : "w-60"
        }`}
    >
      {/* --- Bookmark Collapse Button --- */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300"
        aria-label="Toggle Sidebar"
      >
        {collapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
      </button>

      {/* --- Header: Logo --- */}
      <div className={`flex items-center h-20 px-6 ${collapsed ? "justify-center" : ""}`}>
        {/* Logo Icon */}
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white overflow-hidden">
          {/* Logo Image Placeholder */}
          {/* <img src="/placeholder-logo.png" alt="K" className="w-full h-full object-cover hidden" /> */}
          <span className="font-bold text-lg">{storeName.charAt(0).toUpperCase()}</span>
        </div>

        {/* Text Details */}
        <div
          className={`ml-3 overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
        >
          <h2 className="text-sm font-bold text-gray-800 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
            {storeName}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
            {branchName}
          </p>
        </div>
      </div>

      {/* --- Main Navigation (Flex Grow pushes footer down) --- */}
      <nav className={`flex-1 px-3 py-4 space-y-1 ${collapsed ? "overflow-visible" : "overflow-y-auto"}`}>
        {sidebarMenu.map((item, index) => (
          <SidebarItem key={index} item={item} collapsed={collapsed} />
        ))}

        {isManager && (
          <>
            <div className={`my-4 border-t border-gray-100 dark:border-gray-800 ${collapsed ? "mx-2" : "mx-4"}`}></div>
            <SidebarItem
              item={{ title: "Staff Management", href: "/dashboard/staff", icon: Users }}
              collapsed={collapsed}
            />
            <SidebarItem
              item={{ title: "Store Management", href: "/dashboard/store", icon: Store }}
              collapsed={collapsed}
            />
          </>
        )}

      </nav>

      {/* --- Footer: Help Center --- */}
      <div className="p-3 mt-auto border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/dashboard/help"
          className={`flex items-center px-3 py-3 rounded-lg transition-colors group ${collapsed ? "justify-center" : ""
            } hover:bg-green-50 dark:hover:bg-slate-800`}
        >
          <FaQuestionCircle className="text-gray-400 group-hover:text-green-600 text-xl transition-colors" />

          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-green-700 transition-colors">
                Help Center
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}