"use client";

import { X } from "lucide-react";

type SearchBoxProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBox({
  value,
  onChange,
  placeholder = "جست‌وجو در محصولات…",
  className = "",
}: SearchBoxProps) {
  return (
    <div className={`relative w-full sm:w-96 ${className}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-purple-400"
        aria-label="Search products"
      />

      {value.trim().length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
