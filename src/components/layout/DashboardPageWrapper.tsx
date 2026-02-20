'use client';

import React from 'react';
import { DashboardWrapper } from '@/components/custom-components/dashboard-component';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface DashboardPageWrapperProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    loading?: boolean;
    className?: string;
    headerActions?: React.ReactNode;
}

/**
 * A standard wrapper for all dashboard pages to ensure consistent layout and behavior.
 * Integrates Title, Description, and the core DashboardWrapper.
 */
export function DashboardPageWrapper({
    children,
    title,
    description,
    loading = false,
    className,
    headerActions
}: DashboardPageWrapperProps) {
    return (
        <DashboardWrapper padding="lg" margin="md" className={cn("bg-transparent dark:bg-transparent", className)}>
            {/* Page Header */}
            {(title || description || headerActions) && (
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        {title && (
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {description}
                            </p>
                        )}
                    </div>
                    {headerActions && (
                        <div className="flex-shrink-0">
                            {headerActions}
                        </div>
                    )}
                </div>
            )}

            {/* Page Content */}
            <div className="flex-1">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : (
                    children
                )}
            </div>
        </DashboardWrapper>
    );
}
