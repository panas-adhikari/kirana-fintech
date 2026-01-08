import Link from 'next/link';
import Logo from '@/components/logo/logo';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-secondary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center h-full"
                    >
                        <div className="flex items-center">
                            <Logo className="h-auto max-h-[250px] w-auto max-w-[500px]" /> {/* Pass className prop */}
                            <span className="text-emerald-500 text-2xl font-bold tracking-tight"></span>
                        </div>
                    </Link>

                    {/* Center Navigation */}
                    <nav className="hidden md:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
                        <Link
                            href="#how-it-works"
                            className="font-medium text-brand-text hover:text-brand-primary transition-colors"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="#faq"
                            className="font-medium text-brand-text hover:text-brand-primary transition-colors"
                        >
                            FAQ
                        </Link>
                    </nav>

                    {/* Auth Actions */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/login"
                            className="font-semibold text-brand-text hover:text-brand-primary transition-colors"
                        >
                            Log In
                        </Link>

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
