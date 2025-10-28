"use client";

import "../styles/globals.css";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [domain, setDomain] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setDomain(window.location.hostname);
    }
  }, []);

  const PLAUSIBLE_DOMAINS = ["zahraadelinia.vercel.app", "zahraadelinia.dev"];
  const isProduction = process.env.NODE_ENV === "production";
  const enableAnalytics = isProduction && PLAUSIBLE_DOMAINS.includes(domain);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {enableAnalytics && (
          <Script
            strategy="afterInteractive"
            data-domain={domain}
            src="https://plausible.io/js/script.js"
          />
        )}
        <title>Zahra Adelinia | Portfolio</title>
        <meta
          name="description"
          content="Full-Stack Developer specializing in React, Next.js, and TypeScript."
        />
      </head>

      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-4xl mx-auto p-6">
            {mounted && children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
