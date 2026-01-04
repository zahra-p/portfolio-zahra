"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function OrdersSearchBox({
  value,
  onChange,
  placeholder = "Search by Order ID…",
  className = "",
}: Props) {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-900 px-3 py-2 pr-10 text-sm outline-none
                   focus:ring-2 focus:ring-purple-400"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2
                     text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
