'use client';

import Sidebar from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase/client';
import RoleGuard from '@/components/auth/RoleGuard';
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { fetchProfile, profile, loading, initialized } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await fetchProfile(user.id);
            }
        };

        if (!initialized && !loading) {
            initAuth();
        }
    }, [fetchProfile, initialized, loading]);

    return (
        <RoleGuard>
            <div className="h-screen flex flex-row bg-gray-50 dark:bg-slate-900 overflow-hidden">
                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar />

                    <main className="flex-1 overflow-y-auto p-0 scroll-smooth">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}
