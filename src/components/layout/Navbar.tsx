'use client';

import React, { useState } from 'react';
import { Search, Clock, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { logoutUser } from '@/lib/services/authServices';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/useAuthStore';

interface NavbarProps {
  userAvatar?: string;
}

export function Navbar({ userAvatar }: NavbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { profile } = useAuthStore();
  const userName = profile?.username || 'User';

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      // Clear store on logout
      useAuthStore.getState().clearAuth();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
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

      {/* Background & Inside Effects */}
      <div
        className={`
          relative group w-full
          bg-gradient-to-b from-white to-gray-50 
          dark:from-slate-800 dark:to-slate-900
          border-b border-gray-200 dark:border-slate-700 
          ring-1 ring-inset ring-white/50 dark:ring-white/5
          shadow-[0_2px_4px_rgba(0,0,0,0.04)] 
          transition-all duration-500 ease-in-out
          hover:shadow-[0_8px_30px_rgba(52,211,153,0.25)]
          dark:hover:shadow-[0_8px_30px_rgba(52,211,153,0.15)]
          hover:border-emerald-200 dark:hover:border-emerald-900/50
        `}
      >
        {/* Idle Scanner Animation */}
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/search:text-emerald-500 transition-colors" />
                <Input
                  placeholder="Search transactions..."
                  className="w-80 pl-10 h-10 bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-600 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all"
                />
              </div>

              {/* Clock/Calendar */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
                <Clock className="w-5 h-5" />
              </button>

              {/* User Avatar & Logout */}
              <div className="flex items-center space-x-3">
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

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className={`w-5 h-5 ${loggingOut ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}