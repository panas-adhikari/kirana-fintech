import Sidebar from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-row bg-gray-50 dark:bg-slate-900">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar userName="Hari" />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
