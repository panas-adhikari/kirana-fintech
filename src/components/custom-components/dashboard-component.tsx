'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardWrapperProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  margin?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  border?: boolean;
  borderColor?: 'default' | 'subtle' | 'strong';
}

/**
 * DashboardWrapper - A flexible layout wrapper for dashboard content
 * Handles padding, margin, and border styling
 * 
 * @example
 * ```tsx
 * <DashboardWrapper padding="lg" border>
 *   <YourDashboardContent />
 * </DashboardWrapper>
 * ```
 */
export function DashboardWrapper({
  children,
  className,
  padding = 'lg',
  margin = 'md',
  border = false,
  borderColor = 'default',
}: DashboardWrapperProps) {
  const paddingClasses = {
    sm: 'p-2 sm:p-3 lg:p-4',
    md: 'p-4 sm:p-6 lg:p-8',
    lg: 'p-2 sm:p-4 lg:p-6',
    xl: 'p-8 sm:p-12 lg:p-16',
    none: 'p-0',
  };

  const marginClasses = {
    sm: 'm-1 sm:m-2 lg:m-2',
    md: 'm-2 sm:m-3 lg:m-4',
    lg: 'm-6 sm:m-8 lg:m-12',
    xl: 'm-8 sm:m-12 lg:m-16',
    none: 'm-0',
  };

  const borderClasses = {
    default: 'border border-gray-200 dark:border-slate-700',
    subtle: 'border border-gray-100 dark:border-slate-800',
    strong: 'border-2 border-gray-300 dark:border-slate-600',
  };

  return (
    <div
      className={cn(
        'flex-1 flex flex-col',
        'bg-white dark:bg-slate-800',
        'rounded-lg',
        // 'overflow-y-auto', // Removed to let parent handle scroll
        // 'max-h-[calc(100vh-4rem)]', // Removed to fit dynamic viewport
        paddingClasses[padding],
        marginClasses[margin],
        border && borderClasses[borderColor],
        className
      )}
    >
      {children}
    </div>
  );
}
