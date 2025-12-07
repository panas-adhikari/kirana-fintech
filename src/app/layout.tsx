import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/config/constants";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-[100dvh] overflow-hidden bg-gray-50 dark:bg-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
