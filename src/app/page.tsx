"use client"

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from 'framer-motion';

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-24 md:py-40 flex flex-col items-center justify-center text-center px-4"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-bold text-brand-primary leading-[1.1] mb-10 tracking-tight">
              Effortless Bookkeeping for Your Growing Business.
            </h1>
            <p className="text-xl md:text-2xl text-brand-text max-w-2xl mx-auto leading-relaxed opacity-80 mb-12">
              KiranaFinTech_KIT simplifies your daily operations, tracks inventory, and manages transactions with a modern monochromatic design built for Nepal.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/register">
                <Button size="lg" className="bg-brand-primary text-white px-10 py-8 text-xl rounded-[12px] hover:bg-[#153427] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-brand-primary text-brand-primary bg-brand-secondary/30 px-10 py-8 text-xl rounded-[12px] hover:bg-brand-secondary/50 transition-all hover:-translate-y-1">
                  Sign In to Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works (Process Section) */}
        <section id="how-it-works" className="py-24 md:py-32 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...fadeInUp}
              className="text-brand-primary text-center mb-24 uppercase tracking-[0.3em] text-sm font-black"
            >
              How It Works
            </motion.h2>

            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12"
            >
              {[
                { step: "1", title: "Register Store", desc: "Sign up your kirana store in seconds and set up your initial inventory and customer base." },
                { step: "2", title: "Track Sales", desc: "Record daily transactions, manage credit sales, and keep an eye on your cash flow in real-time." },
                { step: "3", title: "Analyze Growth", desc: "Generate detailed reports and insights to help you make informed decisions for your business expansion." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center text-3xl font-bold mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-black text-brand-primary mb-5">{item.title}</h3>
                  <p className="text-brand-text font-light leading-relaxed text-lg opacity-70">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 md:py-40 bg-brand-secondary/40 scroll-mt-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...fadeInUp}
              className="text-4xl md:text-5xl font-black text-brand-primary text-center mb-20"
            >
              Frequently Asked Questions
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-6">
                {[
                  { q: "Is KiranaFinTech available in Nepali?", a: "Yes, KiranaFinTech is fully localized for Nepal, supporting both English and Nepali languages to ensure ease of use for all store owners." },
                  { q: "Can I track customer credit (Udhaar)?", a: "Absolutely. Our specialized credit management system lets you record udhaar, set reminders, and track individual customer balances effortlessly." },
                  { q: "How secure is my business data?", a: "Your data is encrypted and backed up in real-time. We use enterprise-grade security to ensure your business information remains private and accessible only to you." },
                  { q: "What equipment do I need to start?", a: "All you need is a smartphone or a computer with an internet connection. No expensive hardware or POS machines are required to get started." }
                ].map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="bg-white border-none rounded-2xl px-8 shadow-sm hover:shadow-md transition-all">
                    <AccordionTrigger className="text-xl font-bold text-brand-primary hover:no-underline py-8">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-brand-text/80 text-lg leading-relaxed pb-8">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
