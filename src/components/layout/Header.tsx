import Link from 'next/link';
import { APP_NAME } from '@/config/constants';

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-brand-secondary/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 text-brand-primary transition-colors">
                        <span className="text-2xl font-bold tracking-tight">KiranaFinTech<span className="text-emerald-500">_KIT</span></span>
                    </Link>

                    {/* Centered Navigation */}
                    <nav className="hidden md:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
                        <Link href="#how-it-works" className="text-brand-text font-medium hover:text-brand-primary transition-colors">How It Works</Link>
                        <Link href="#faq" className="text-brand-text font-medium hover:text-brand-primary transition-colors">FAQ</Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-6">
                        <Link href="/login" className="text-brand-text font-semibold hover:text-brand-primary transition-colors">Log In</Link>
                        <Link href="/register">
                            <button className="bg-brand-primary text-white px-8 py-2.5 rounded-full font-semibold hover:bg-brand-primary/90 transition-all shadow-sm">
                                Sign Up
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
}
