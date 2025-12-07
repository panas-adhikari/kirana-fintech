import Sidebar from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full flex flex-row bg-gray-50 dark:bg-slate-900 overflow-hidden">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Navbar userName="Hari" />

                <div className="flex-1 flex flex-col overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
