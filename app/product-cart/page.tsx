"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ProductCard from "./components/ProductCard";
import { fetchProducts } from "../../lib/api/products";
import { createOrder as createOrderApi } from "../../lib/api/orders";

import {
  addItem,
  removeOne,
  removeItem,
  clearCart,
  selectItems,
  selectTotalPrice,
  selectTotalQuantity,
} from "../../lib/features/cartSlice";

import { SkeletonCard } from "./components/SkeletonCard";
//import { EmptyState } from "./components/EmptyState";
//import { ErrorState } from "./components/ErrorState";

export default function ProductCartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const dispatch = useDispatch();

  // ---------- URL ↔ UI: initialize from query string ----------
  const initialQuery = searchParams.get("q") ?? "";
  const initialFilter: "all" | "available" =
    searchParams.get("available") === "true" ? "available" : "all";

  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<"all" | "available">(initialFilter);

  // ---------- Redux selectors ----------
  const items = useSelector(selectItems);
  const totalPrice = useSelector(selectTotalPrice);
  const totalQuantity = useSelector(selectTotalQuantity);

  // ---------- React Query: products ----------
  const {
    data: products,
    isLoading,
    isError: isProductsError,
    error: productsError,
    isFetching, // هنگام refetch
  } = useQuery({
    queryKey: ["products"], // (فعلاً API بدون فیلتر؛ فیلتر سمت کلاینت انجام می‌شود)
    queryFn: fetchProducts,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  // ---------- Client-side filter (name + availability) ----------
  const filtered = useMemo(() => {
    const list = products ?? [];
    const byAvail =
      filter === "available" ? list.filter((p) => p.available) : list;

    if (!query.trim()) return byAvail;

    const q = query.trim().toLowerCase();
    // برای فارسی هم همین متد کار می‌کند
    return byAvail.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, filter, query]);

  // ---------- Sync UI to URL (debounced-ish) ----------
  useEffect(() => {
    // سینک به /product-cart?q=&available=true
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (filter === "available") params.set("available", "true");
    const qs = params.toString();
    router.push(qs ? `/product-cart?${qs}` : `/product-cart`, {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter]); // فقط وقتی Query/Filter عوض شد

  // ---------- Create order (mutation) ----------
  const { mutate: submitOrder, isPending } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (data) => {
      dispatch(clearCart());
      qc.invalidateQueries({ queryKey: ["orders"] });

      toast.success(
        <div className="text-center" dir="ltr">
          <p>Your order was registered with number {data.id}. 🎉</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <button
              onClick={() => router.push(`/orders/${data.id}`)}
              className="underline"
            >
              View order {data.id}
            </button>
            <Link href="/product-cart" className="underline">
              Continue shopping
            </Link>
          </div>
        </div>
      );
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "Order failed";
      toast.error(msg);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          🛍️ Demo Storefront
        </h1>
        <motion.div
          key={totalQuantity}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="text-lg font-semibold text-green-600 dark:text-green-400"
        >
          🛒 {totalQuantity}
        </motion.div>
      </nav>

      {/* نوار باریک هنگام refetch محصولات
      {isFetching && !isLoading && (
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse mb-2 rounded" />
      )} */}

      {/* کنترل‌ها: سرچ + فیلتر */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-8 px-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جست‌وجو در محصولات…"
          className="w-full sm:w-96 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div className="inline-flex border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          {(["all", "available"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                filter === opt
                  ? "bg-purple-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {opt === "all" ? "همه" : "فقط موجودها"}
            </button>
          ))}
        </div>
      </div>

      {/* وضعیت خطا */}
      {isProductsError && (
        <div className="text-center text-red-600">
          خطا در بارگذاری:{" "}
          {productsError instanceof Error
            ? productsError.message
            : "خطای ناشناخته"}
        </div>
      )}

      {/* محصولات: لودینگ → Skeleton | غیر از آن → Grid */}
      {isLoading ? (
        <SkeletonCard count={8} />
      ) : !isProductsError ? (
        <div
          className={`px-6 max-w-6xl mx-auto pb-12 ${
            isFetching && !isLoading ? "animate-pulse" : ""
          }`}
        >
          {/* نوار باریک refetch بالای باکس محصولات */}

          <div
            className={`w-full mb-3 rounded transition-all ${
              isFetching && !isLoading
                ? "h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"
                : "h-0"
            }`}
          />

          {/* باکس محصولات */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-4">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500">
                نتیجه‌ای با این فیلتر/جست‌وجو پیدا نشد.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    available={product.available}
                    image={product.image}
                    onAddToCart={
                      product.available
                        ? () =>
                            dispatch(
                              addItem({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                              })
                            )
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* سبد خرید پایین صفحه */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 px-6 rounded-t-2xl shadow-inner">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          🧾 سبد خرید
        </h2>

        {items.length === 0 ? (
          <p className="text-gray-500">سبد خرید خالی است.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-2 text-gray-800 dark:text-gray-200"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    {(item.price * item.quantity).toLocaleString()} تومان
                    <button
                      onClick={() => dispatch(removeOne({ id: item.id }))}
                      className="px-2 py-1 mx-1.5 text-sm text-amber-700 border border-amber-700 rounded hover:bg-amber-700 hover:text-white transition"
                    >
                      کم کن
                    </button>
                    <button
                      onClick={() => dispatch(removeItem({ id: item.id }))}
                      className="px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      حذف
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center mt-4">
              <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
                جمع کل: {totalPrice.toLocaleString()} تومان
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  خالی کردن سبد
                </button>
                <button
                  disabled={!items.length || isPending}
                  onClick={() =>
                    submitOrder({
                      items: items.map((i) => ({
                        id: String(i.id),
                        quantity: i.quantity,
                        price: i.price,
                      })),
                      total: totalPrice,
                    })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {isPending ? "در حال ثبت..." : "ثبت سفارش"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
