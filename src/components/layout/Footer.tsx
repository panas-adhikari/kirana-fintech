import './Footer.css';
import { APP_NAME } from '@/config/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <p className="footer-text">
                        © {currentYear} {APP_NAME}. Made for local stores in Nepal.
                    </p>
                    <div className="footer-links">
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                        <a href="/support" className="footer-link">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
