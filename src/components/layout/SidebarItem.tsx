"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import this to detect active page
import type { SidebarMenuItem } from "@/config/sidebar";
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // Clean arrows

interface SidebarItemProps {
  item: SidebarMenuItem;
  collapsed: boolean;
}

export default function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);

  const hasChildren = item.children && item.children.length > 0;

  // Check if this item is active
  const isActive = pathname === item.href || (hasChildren && item.children?.some(sub => sub.href === pathname));

  // Common classes for the container
  const baseClasses = `
    flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 group relative
    ${isActive
      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium"
      : "text-gray-900 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-slate-800 dark:hover:text-white"}
    ${collapsed ? "justify-center" : ""}
  `;

  return (
    <div className="mb-1">
      {/* --- Main Item --- */}
      {/* --- Main Item Logic --- */}
      {/* 
        This is the "Pill" expansion logic:
        1. Base container is relative for positioning.
        2. When collapsed, the link/button becomes absolute and expands on hover.
      */}
      {!hasChildren ? (
        <div className={`relative ${collapsed ? "h-12 w-full flex justify-center group/item" : ""}`}>
          <Link
            href={item.href}
            className={`
              flex items-center rounded-lg transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden
              ${collapsed
                // Collapsed State: Absolute expanding pill
                ? `absolute left-0 top-0 h-10 w-10 z-20 shadow-sm border border-transparent
                   hover:w-auto hover:min-w-[max-content] hover:z-50 hover:shadow-xl hover:bg-green-50
                   hover:pr-4 hover:border-gray-100 dark:hover:border-gray-700 dark:hover:bg-slate-800
                   pl-2.5` // Centered icon: w-10(40px), icon~20px. pl-2.5(10px) -> 10+20+10 = 40.
                // Expanded State: Normal flow
                : baseClasses
              }
            `}
          >
            {/* Icon - Always visible */}
            <span className={`text-xl flex-shrink-0 ${isActive ? "text-green-600" : "text-gray-900 group-hover/item:text-green-600 transition-colors"}`}>
              <item.icon />
            </span>

            {/* Label - Reveals on expand */}
            <span
              className={`ml-3 text-sm font-medium transition-all duration-300
                ${collapsed
                  ? "opacity-0 w-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:w-auto group-hover/item:translate-x-0 group-hover/item:text-green-700 text-gray-800 dark:text-gray-200"
                  : "opacity-100 w-auto"}
              `}
            >
              {item.title}
            </span>
          </Link>
        </div>
      ) : (
        // --- Parent Item with Dropdown (Similar logic if needed, or keeping standard behavior for parent items) ---
        // For parent items, expanding might be tricky if it has a submenu. 
        // Let's apply a simplified expansion for now, or keep it standard if interaction is complex.
        <button
          onClick={() => !collapsed && setOpen(!open)}
          className={`
              ${baseClasses}
              ${collapsed ? "hover:bg-gray-50 dark:hover:bg-slate-800" : ""}
           `}
        >
          <span className={`text-xl ${isActive ? "text-green-600" : "text-gray-900 group-hover:text-gray-600"}`}>
            <item.icon />
          </span>

          {!collapsed && (
            <>
              <span className="ml-3 text-sm flex-1 text-left whitespace-nowrap">
                {item.title}
              </span>
              <span className="text-xs text-gray-400">
                {open ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </>
          )}
        </button>
      )}

      {/* --- Submenu --- */}
      {hasChildren && open && !collapsed && (
        <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-2">
          {item.children!.map((sub, idx) => {
            const isSubActive = pathname === sub.href;
            return (
              <Link
                key={idx}
                href={sub.href}
                className={`block px-3 py-2 text-sm rounded-md transition-colors ${isSubActive
                  ? "text-green-600 bg-green-50 font-medium"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
              >
                {sub.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}