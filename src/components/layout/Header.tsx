import Link from 'next/link';
import './Header.css';
import { APP_NAME } from '@/config/constants';

export default function Header() {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link href="/" className="header-logo">
                        <span className="header-logo-text">{APP_NAME}</span>
                    </Link>

                    <nav className="header-nav">
                        <Link href="/dashboard" className="header-nav-link">Dashboard</Link>
                        <Link href="/transactions" className="header-nav-link">Transactions</Link>
                        <Link href="/inventory" className="header-nav-link">Inventory</Link>
                        <Link href="/reports" className="header-nav-link">Reports</Link>
                    </nav>

                    <div className="header-actions">
                        <Link href="/login" className="header-nav-link">Login</Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
