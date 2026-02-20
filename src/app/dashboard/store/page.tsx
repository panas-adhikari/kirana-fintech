'use client';
export const dynamic = 'force-dynamic';

import { useAuthStore } from '@/store/useAuthStore';
import { OwnerStoreView } from '@/components/store/OwnerStoreView';
import { AdminStoreView } from '@/components/store/AdminStoreView';
import { DashboardPageWrapper } from '@/components/layout/DashboardPageWrapper';

export default function StorePage() {
    const { profile, loading } = useAuthStore();

    if (loading) return <DashboardPageWrapper loading={true} children={null} />;
    if (!profile) return null;

    return (
        <DashboardPageWrapper>
            {(profile.role === 'owner' || profile.role === 'manager') && (
                <>
                    <div className="bg-yellow-100 p-2 text-xs font-mono border-b border-yellow-200 text-yellow-800 rounded-t-xl">
                        DEBUG: Role: {profile.role} | BranchID: {profile.branch_id || 'MISSING'}
                    </div>
                    <OwnerStoreView />
                </>
            )}

            {profile.role === 'admin' && (
                <>
                    <div className="bg-blue-100 p-2 text-xs font-mono border-b border-blue-200 text-blue-800 rounded-t-xl">
                        DEBUG: Role: {profile.role} | StoreID: {profile.branch?.store_id || 'MISSING'}
                    </div>
                    <AdminStoreView />
                </>
            )}

            {profile.role !== 'admin' && profile.role !== 'owner' && profile.role !== 'manager' && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
                    <h2 className="text-xl font-semibold">Access Denied</h2>
                    <p>You do not have permission to view this page.</p>
                </div>
            )}
        </DashboardPageWrapper>
    );
}
