'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DashboardPageWrapper } from '@/components/layout/DashboardPageWrapper';
import { sidebarMenu } from '@/config/sidebar';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CatchAllDashboardPage({ params }: { params: { slug: string[] } }) {
    const pathname = usePathname();

    // Try to find the title from the sidebar menu if it exists
    const menuItem = sidebarMenu.find(item => item.href === pathname);
    const pageTitle = menuItem?.title || params.slug[params.slug.length - 1].replace(/-/g, ' ');

    return (
        <DashboardPageWrapper
            title={pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)}
            description="Feature development in progress"
        >
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
                    <Construction className="w-10 h-10 text-emerald-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Coming Soon
                </h3>

                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                    The <strong>{pageTitle}</strong> feature is currently under active development and will be available in a future update.
                </p>

                <Link href="/dashboard">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </DashboardPageWrapper>
    );
}
