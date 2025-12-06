import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/config/constants';
import Sidebar from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { DashboardCards } from '@/components/custom-components/custom-card';
import { CashFlowChart } from '@/components/custom-components/cash-flow-chart';
import { RecentActivity } from '@/components/custom-components/recent-activity';
import { DashboardWrapper } from '@/components/custom-components/dashboard-component';

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex flex-row bg-gray-50 dark:bg-slate-900">
            <Sidebar />
            
            <div className="flex flex-1 flex-col">
                <Navbar userName="Hari" />

                <div className="flex-1 flex flex-col overflow-auto">
                    {/* Dashboard Content */}
                    <DashboardWrapper padding="lg" margin="md">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome back, Hari!
                            </h2>
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
                </div>
            </div>
        </div>
    );
}
