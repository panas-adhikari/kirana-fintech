import { APP_NAME } from '@/config/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        © {currentYear} {APP_NAME}. Made for local stores in Nepal.
                    </p>
                    <div className="flex items-center space-x-6">
                        <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Privacy</a>
                        <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Terms</a>
                        <a href="/support" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
