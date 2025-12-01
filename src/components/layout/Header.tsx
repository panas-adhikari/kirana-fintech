import Link from 'next/link';
import { APP_NAME } from '@/config/constants';

export default function Header() {
    return (
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        <span className="text-xl font-bold">{APP_NAME}</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                        <Link href="/transactions" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Transactions</Link>
                        <Link href="/inventory" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inventory</Link>
                        <Link href="/reports" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Reports</Link>
                    </nav>

                    <div className="flex items-center space-x-6">
                        <Link href="/login" prefetch={false} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Login</Link>
                        <Link href="/register" prefetch={false} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Register</Link>
                    </div>

                </div>
            </div>
        </header>
    );
}
