'use client';
export const dynamic = 'force-dynamic';

import { StaffManagementView } from '@/components/staff/StaffManagementView';
import { useAuthStore } from '@/store/useAuthStore';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardPageWrapper } from '@/components/layout/DashboardPageWrapper';

export default function StaffPage() {
    const { profile, loading } = useAuthStore();

    useEffect(() => {
        if (!loading && profile) {
            const allowedRoles = ['admin', 'owner', 'manager'];
            if (!allowedRoles.includes(profile.role)) {
                redirect('/dashboard');
            }
        }
    }, [profile, loading]);

    return (
        <DashboardPageWrapper loading={loading}>
            <StaffManagementView />
        </DashboardPageWrapper>
    );
}
