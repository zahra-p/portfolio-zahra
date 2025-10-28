"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4"
      >
        404
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-2xl font-semibold mb-3"
      >
        Oops! Page Not Found
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-gray-600 dark:text-gray-300 max-w-md mb-8"
      >
        Looks like you wandered off the main path. The page you're looking for
        doesn't exist or may have been moved.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 180 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
        >
          <FaHome className="text-lg" />
          Back to Home
        </Link>
      </motion.div>
    </section>
  );
}
