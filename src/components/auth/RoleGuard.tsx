'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

type Role = 'admin' | 'user' | 'owner' | 'staff' | 'manager';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    fallbackPath?: string;
}

/**
 * RoleGuard component checks if the current user has the required roles.
 * If allowedRoles is empty or undefined, any logged-in user with a profile can access.
 */
export default function RoleGuard({
    children,
    allowedRoles,
    fallbackPath = '/dashboard'
}: RoleGuardProps) {
    const { profile, loading, initialized } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if (initialized && !loading && !profile) {
            router.push('/login');
        }
    }, [initialized, loading, profile, router]);

    // Show a loader while fetching profile
    if (loading || !initialized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
        );
    }

    // If no profile found after initialization, we return null while useEffect handles redirection
    if (!profile) {
        return null;
    }

    // Check if user role is allowed
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(profile.role as Role)) {
        // If not allowed, we could show an "Unauthorized" message or redirect
        return (
            <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You don't have permission to view this page.
                </p>
                <button
                    onClick={() => router.push(fallbackPath)}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
