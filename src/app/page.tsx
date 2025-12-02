import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { APP_NAME } from '@/config/constants';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Smart Financial Management for<br />
                <span className="text-blue-600 dark:text-blue-400">Nepal's Kirana Stores</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Simplify your daily operations, track inventory, manage transactions,
                and grow your local business with modern fintech solutions designed
                specifically for Nepal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg">Lets Go</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Everything You Need to Run Your Store</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
              Built for the unique needs of Nepali kirana stores
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Transaction Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Record sales, purchases, and expenses in NPR. Track cash and digital payments with ease.
                </p>
              </Card>

              <Card>
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Inventory Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Keep track of your stock levels, set reorder alerts, and manage products efficiently.
                </p>
              </Card>

              <Card>
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Credit Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage customer credit, track outstanding balances, and send payment reminders.
                </p>
              </Card>

              <Card>
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Business Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get insights into your sales trends, top products, and profit margins.
                </p>
              </Card>

              <Card>
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Reliable</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data is encrypted and backed up automatically. Access from anywhere.
                </p>
              </Card>

              <Card>
                <div className="text-4xl mb-4">🇳🇵</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Made for Nepal</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Support for Nepali language, NPR currency, and local business practices.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-700 border-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Store?</h2>
              <p className="text-lg text-blue-100 mb-6">
                Join hundreds of kirana stores across Nepal using {APP_NAME} to grow their business.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">Start Free Trial</Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
