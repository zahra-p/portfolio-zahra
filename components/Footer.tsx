"use client";
import { FaGithub, FaLinkedin } from "react-icons/fa";

/**
 * Footer component
 * ----------------
 * نمایش در پایین همه صفحات، شامل لینک‌های اجتماعی و سال فعلی.
 */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-300 dark:border-gray-700 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="flex justify-center gap-5 mb-3">
        {/* لینک گیت‌هاب */}
        <a
          href="https://github.com/zahraadelinia"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-500 transition"
        >
          <FaGithub className="text-lg" />
        </a>

        {/* لینک لینکدین */}
        <a
          href="https://linkedin.com/in/zahraadelinia"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-500 transition"
        >
          <FaLinkedin className="text-lg" />
        </a>
      </div>

      <p>
        © {year} Zahra Adelinia. Built with ❤️ using{" "}
        <span className="text-purple-500 font-medium">Next.js</span> &{" "}
        <span className="text-purple-500 font-medium">TailwindCSS</span>.
      </p>
    </footer>
  );
}
