import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { APP_NAME } from '@/config/constants';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex flex-row bg-gray-50 dark:bg-slate-900">
            {/* <div className="fixed">
                <Sidebar />
            </div> */}
            <Sidebar />

            <div className="flex-1 flex flex-col "> 
            {/* Dashboard Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {APP_NAME}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm">
                                Settings
                            </Button>
                            <Button variant="outline" size="sm">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome Back!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Here's what's happening with your store today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Today's Sales
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    NPR 12,450
                                </p>
                            </div>
                            <div className="text-4xl">💰</div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                            +15% from yesterday
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Total Items
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    342
                                </p>
                            </div>
                            <div className="text-4xl">📦</div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            23 low stock items
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Pending Credit
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    NPR 8,200
                                </p>
                            </div>
                            <div className="text-4xl">💳</div>
                        </div>
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                            12 customers
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    This Month
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    NPR 245,600
                                </p>
                            </div>
                            <div className="text-4xl">📈</div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                            +8% from last month
                        </p>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button className="h-auto py-6 flex flex-col items-center gap-2">
                            <span className="text-2xl">➕</span>
                            <span>New Sale</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                            <span className="text-2xl">📦</span>
                            <span>Add Product</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                            <span className="text-2xl">👤</span>
                            <span>Add Customer</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                            <span className="text-2xl">💸</span>
                            <span>Record Expense</span>
                        </Button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Recent Transactions
                        </h3>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            Sale #{1234 + i}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Customer #{100 + i}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            NPR {(i * 450).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {i} hours ago
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/transactions"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                            >
                                View all transactions →
                            </Link>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Low Stock Alerts
                        </h3>
                        <div className="space-y-3">
                            {['Rice (5kg)', 'Cooking Oil', 'Sugar', 'Tea Leaves', 'Biscuits'].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {item}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            SKU: {1000 + i}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                            {5 - i} units left
                                        </p>
                                        <Button size="sm" variant="outline" className="mt-1">
                                            Reorder
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/inventory"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                            >
                                View all inventory →
                            </Link>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
        </div>
    );
}
