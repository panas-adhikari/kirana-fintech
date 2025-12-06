import { APP_NAME } from '@/config/constants';
import { DashboardCards } from '@/components/custom-components/custom-card';
import { CashFlowChart } from '@/components/custom-components/cash-flow-chart';
import { RecentActivity } from '@/components/custom-components/recent-activity';
import { DashboardWrapper } from '@/components/custom-components/dashboard-component';

import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal';

export default function DashboardPage() {
    return (
        <DashboardWrapper padding="lg" margin="md">
            {/* Welcome Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, Hari!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Here's what's happening with your store today.
                    </p>
                </div>
                <AddTransactionModal />
            </div>

            {/* Stats Grid */}
            <div className="mb-8">
                <DashboardCards />
            </div>

            {/* Cash Flow and Recent Activity Section */}
            <div className="grid grid-cols-3 gap-6">
                <CashFlowChart
                    opening="79,336.89"
                    netChange="45,231.00"
                    closing="124,567.89"
                />
                <RecentActivity />
            </div>
        </DashboardWrapper>
    );
}
