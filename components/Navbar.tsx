"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";

/**
 * Navbar component
 * ----------------
 * منوی بالای سایت با لینک به صفحات اصلی و دکمه تغییر حالت تاریک/روشن.
 */

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Name */}
        <Link
          href="/"
          className="text-xl font-bold text-purple-600 dark:text-purple-400 tracking-wide hover:opacity-80 transition"
        >
          Zahra<span className="text-gray-700 dark:text-gray-200">.dev</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium ${
                pathname === link.href
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-300"
              } transition`}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle Button */}
          <ThemeToggle />
          {/* Download CV button */}
          <a
            href="/ZahraAdelinia2025-1.pdf"
            download
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-500 transition-transform transform hover:scale-105"
          >
            Download CV
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
