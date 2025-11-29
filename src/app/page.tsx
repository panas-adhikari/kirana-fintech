import './page.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { APP_NAME } from '@/config/constants';

export default function Home() {
  return (
    <div className="page-wrapper">
      <Header />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Smart Financial Management for<br />
                <span className="hero-highlight">Nepal's Kirana Stores</span>
              </h1>
              <p className="hero-description">
                Simplify your daily operations, track inventory, manage transactions,
                and grow your local business with modern fintech solutions designed
                specifically for Nepal.
              </p>
              <div className="hero-actions">
                <Button size="lg">Get Started</Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="section-title">Everything You Need to Run Your Store</h2>
            <p className="section-description">
              Built for the unique needs of Nepali kirana stores
            </p>

            <div className="features-grid">
              <Card>
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Transaction Management</h3>
                <p className="feature-description">
                  Record sales, purchases, and expenses in NPR. Track cash and digital payments with ease.
                </p>
              </Card>

              <Card>
                <div className="feature-icon">📦</div>
                <h3 className="feature-title">Inventory Tracking</h3>
                <p className="feature-description">
                  Keep track of your stock levels, set reorder alerts, and manage products efficiently.
                </p>
              </Card>

              <Card>
                <div className="feature-icon">💰</div>
                <h3 className="feature-title">Credit Management</h3>
                <p className="feature-description">
                  Manage customer credit, track outstanding balances, and send payment reminders.
                </p>
              </Card>

              <Card>
                <div className="feature-icon">📈</div>
                <h3 className="feature-title">Business Analytics</h3>
                <p className="feature-description">
                  Get insights into your sales trends, top products, and profit margins.
                </p>
              </Card>

              <Card>
                <div className="feature-icon">🔒</div>
                <h3 className="feature-title">Secure & Reliable</h3>
                <p className="feature-description">
                  Your data is encrypted and backed up automatically. Access from anywhere.
                </p>
              </Card>

              <Card>
                <div className="feature-icon">🇳🇵</div>
                <h3 className="feature-title">Made for Nepal</h3>
                <p className="feature-description">
                  Support for Nepali language, NPR currency, and local business practices.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <Card className="cta-card">
              <h2 className="cta-title">Ready to Transform Your Store?</h2>
              <p className="cta-description">
                Join hundreds of kirana stores across Nepal using {APP_NAME} to grow their business.
              </p>
              <Button size="lg">Start Free Trial</Button>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
