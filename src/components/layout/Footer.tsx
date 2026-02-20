import { APP_NAME } from '@/config/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-brand-secondary mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-brand-text/60 text-sm font-medium">
                        © {currentYear} KiranaFinTech<span className="text-brand-primary">_KIT</span>. Empowering local stores across Nepal.
                    </p>
                    <div className="flex items-center space-x-8">
                        <a href="/privacy" className="text-brand-text/60 hover:text-brand-primary text-sm font-medium transition-colors">Privacy</a>
                        <a href="/terms" className="text-brand-text/60 hover:text-brand-primary text-sm font-medium transition-colors">Terms</a>
                        <a href="/support" className="text-brand-text/60 hover:text-brand-primary text-sm font-medium transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
