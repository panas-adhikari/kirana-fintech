'use client';

import React from 'react';
import { Search, Bell, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  userName?: string;
  userAvatar?: string;
}

export function Navbar({ userName = 'Hari', userAvatar }: NavbarProps) {
  return (
    <>
      {/* 
        Inline style for the custom scanner animation. 
        We define keyframes here so you don't have to edit tailwind.config.js 
      */}
      <style jsx global>{`
        @keyframes scanner-loop {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-scanner {
          animation: scanner-loop 4s linear infinite;
        }
      `}</style>

      <div 
        className="
          relative group w-full
          /* -- Background & Inside Effects -- */
          bg-gradient-to-b from-white to-gray-50 
          dark:from-slate-800 dark:to-slate-900
          border-b border-gray-200 dark:border-slate-700 
          
          /* -- Subtle Inner Highlight (Ring) -- */
          ring-1 ring-inset ring-white/50 dark:ring-white/5
          
          /* -- Shadow & Transition -- */
          shadow-[0_2px_4px_rgba(0,0,0,0.04)] 
          transition-all duration-500 ease-in-out
          
          /* -- Hover State (Mint Shadow) -- */
          hover:shadow-[0_8px_30px_rgba(52,211,153,0.25)]
          dark:hover:shadow-[0_8px_30px_rgba(52,211,153,0.15)]
          hover:border-emerald-200 dark:hover:border-emerald-900/50
        "
      >
        {/* 
          -- The Idle Scanner Animation -- 
          Absolute positioned at the bottom. 
          'group-hover:opacity-0' makes it vanish smoothly when you hover the navbar.
        */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none z-10 transition-opacity duration-300 group-hover:opacity-0">
          <div className="h-full w-32 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scanner blur-[1px]" />
        </div>

        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - Title */}
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Dashboard
            </h1>

            {/* Right - Search, Notifications, and User */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block group/search">
                <Search className="absolute  left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/search:text-emerald-500 transition-colors" />
                <Input
                  placeholder="Search transactions..."
                  className="w-80 pl-10 h-10 bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-600 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                />
              </div>

              {/* Notification Bell */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
                <Bell className="w-5 h-5" />
              </button>

              {/* Clock/Calendar */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
                <Clock className="w-5 h-5" />
              </button>

              {/* User Avatar */}
              <button className="flex items-center space-x-2 p-1 pr-3 rounded-full border border-transparent hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-gray-200 dark:hover:border-slate-600 transition-all">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-700"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {userName}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}