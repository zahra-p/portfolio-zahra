"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { fetchProduct } from "../../../lib/api/products";

// Prefetch روی hover/فوکس (اختیاری: اگر از لیست می‌آیی)
// می‌تونی در لیست محصولات از qc.prefetchQuery(...) استفاده کنی.

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  available: boolean;
  image: string;
  onAddToCart?: () => void;
}

export default function ProductCard({
  id,
  name,
  price,
  available,
  image,
  onAddToCart,
}: ProductCardProps) {
  const qc = useQueryClient();

  const prefetch = () =>
    qc.prefetchQuery({
      queryKey: ["product", id],
      queryFn: () => fetchProduct(id),
      staleTime: 60_000,
    });

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white  dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border
       border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
    >
      {/* تصویر محصول */}
      <div className="relative w-full h-48">
        <Link
          href={`/product/${id}`}
          tabIndex={-1} // ⬅️ از تب خارج
          aria-hidden="true" // ⬅️ برای SR تکرار نشه
          onMouseEnter={prefetch}
          onFocus={prefetch} // اگر با کیبورد روی کارت میای
          className="block relative w-full h-48"
        >
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-opacity duration-500 ${
              available ? "opacity-100" : "opacity-60"
            }`}
          />
          {!available && (
            <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center text-white text-lg font-semibold">
              ناموجود ❌
            </div>
          )}
          {available && (
            <span className="absolute top-2 left-2 z-10 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-300">
              موجود
            </span>
          )}
        </Link>
      </div>

      {/* جزئیات محصول */}
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-200">
          <Link
            href={`/product/${id}`} // ⬅️ لینک اصلی
            onMouseEnter={prefetch}
            onFocus={prefetch}
            className="hover:underline"
          >
            {name}
          </Link>
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-3">
          {price.toLocaleString("fa-IR")} تومان
        </p>

        {available && onAddToCart && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "#22c55e",
              color: "#fff",
            }}
            onClick={onAddToCart}
            className="px-4 py-2 text-sm font-semibold border border-green-500 text-green-600 rounded-lg transition-colors duration-300"
          >
            افزودن به سبد خرید 🛒
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
