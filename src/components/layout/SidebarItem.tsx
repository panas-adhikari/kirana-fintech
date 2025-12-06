"use client";

import { useState } from "react";
import Link from "next/link";
import type { SidebarMenuItem } from "@/config/sidebar";


interface SidebarItemProps {
  item: SidebarMenuItem;
  collapsed: boolean;
}

export default function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const [open, setOpen] = useState<boolean>(false);

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="mb-1">
      {/* Main item (either with a submenu or just a link) */}
      {!hasChildren ? (
        // For items without children, wrap with Link directly
        <Link href={item.href}
            className={`flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition
            ${collapsed ? "" : "text-sm"}`}
           >
            {/* Icon */}
            <span className="text-base"><item.icon /></span>

            {/* Title */}
            {!collapsed && (
              <span className="ml-3 text-sm font-normal text-gray-800 dark:text-gray-200">
                {item.title}
              </span>
            )}
        </Link>
      ) : (
        // For items with children, render as a button that can expand/collapse the submenu
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex items-center w-full px-3 py-2 rounded-lg 
        hover:bg-gray-100 dark:hover:bg-slate-700 transition
        ${open ? "bg-gray-100 dark:bg-slate-800" : ""}`}
      >
        {/* Icon */}
        <span className="text-base"><item.icon /></span>

        {/* Title */}
        {!collapsed && (
          <span className="ml-3 text-sm font normal text-gray-800 dark:text-gray-200">
            {item.title}
          </span>
        )}

        {/* Dropdown arrow */}
        {hasChildren && !collapsed && (
          <span className="ml-auto text-gray-500">{open ? "▲" : "▼"}</span>
        )}
      </button>
    )}

      {/* Timeline Sub Menu */}
        {hasChildren && open && !collapsed && (
          <div className="pl-6 ml-5 mt-1 space-y-1">
            {item.children!.map((sub, idx) => (
              <Link
                key={idx}
                href={sub.href}
                className=" text-sm relative block pl-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-lg"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}

    </div>
  );
}
