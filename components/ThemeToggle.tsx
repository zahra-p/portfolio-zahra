"use client";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

/**
 * ThemeToggle component
 * ---------------------
 * کنترل حالت Dark/Light در کل وب‌سایت.
 * با کلیک روی دکمه، کلاس "dark" به تگ <html> اضافه یا حذف می‌شود.
 * حالت انتخابی در localStorage ذخیره می‌شود تا با رفرش از بین نرود.
 */

export default function ThemeToggle() {
  // حالت اولیه: light
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /**
   * این useEffect فقط یک بار اجرا می‌شود.
   * بررسی می‌کند آیا کاربر قبلاً تم خاصی انتخاب کرده یا خیر.
   * اگر انتخابی در localStorage وجود داشت، همان اعمال می‌شود.
   */
  useEffect(() => {
    //باعث میشه انتخاب کاربر حتی بعد از رفرش حفظ بشه
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    // اگر کاربر قبلاً انتخابی نداشته، حالت  پیش فرض سیستم کاربر را بررسی کن:
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  /**
   * تابع تغییر تم:
   * تم فعلی را عوض می‌کند و در localStorage ذخیره می‌کند.
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <FaMoon className="text-purple-600 text-lg" />
      ) : (
        <FaSun className="text-yellow-400 text-lg" />
      )}
    </button>
  );
}
