'use client';
export const dynamic = 'force-dynamic';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardPageWrapper } from '@/components/layout/DashboardPageWrapper';
import { DashboardCards } from '@/components/custom-components/custom-card';
import { CashFlowChart } from '@/components/custom-components/cash-flow-chart';
import { RecentActivity } from '@/components/custom-components/recent-activity';
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal';

export default function DashboardPage() {
    const { profile } = useAuthStore();
    const userName = profile?.username || 'User';

    return (
        <DashboardPageWrapper
            title={`Welcome back, ${userName}!`}
            description="Here's what's happening with your store today."
            headerActions={<AddTransactionModal />}
        >
            {/* Stats Grid */}
            <div className="mb-6">
                <DashboardCards />
            </div>

            {/* Cash Flow and Recent Activity Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="xl:col-span-2 h-[400px]">
                    <CashFlowChart
                        opening="79,336.89"
                        netChange="45,231.00"
                        closing="124,567.89"
                        cashIn={80000}
                        cashOut={35000}
                    />
                </div>
                <div className="xl:col-span-1 h-full min-h-[350px]">
                    <RecentActivity />
                </div>
            </div>
        </DashboardPageWrapper>
    );
}
