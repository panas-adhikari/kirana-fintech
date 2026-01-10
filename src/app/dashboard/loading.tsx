import { Skeleton } from "@/components/ui/skeleton";
import { DashboardWrapper } from "@/components/custom-components/dashboard-component";
import Sidebar from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen flex flex-row bg-gray-50 dark:bg-slate-900">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col overflow-auto">
                    <DashboardWrapper padding="lg" margin="md">
                        <div className="mb-8 flex justify-between items-center">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-10 w-32" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-36 w-full rounded-xl" />
                            ))}
                        </div>

                        {/* Charts Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <Skeleton className="h-[400px] w-full rounded-xl" />
                            </div>
                            <div className="lg:col-span-1">
                                <Skeleton className="h-[400px] w-full rounded-xl" />
                            </div>
                        </div>
                    </DashboardWrapper>
                </div>
            </div>
        </div>
    );
}
