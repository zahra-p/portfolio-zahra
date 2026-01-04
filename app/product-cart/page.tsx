"use client";

//import Link from "next/link";
import type { QueryKey } from "@tanstack/react-query";
import { qk, type ProductSort } from "../../lib/queryKeys";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";

import { toast } from "sonner";

import ProductCard from "./components/ProductCard";
import SkeletonCard from "./components/SkeletonCard";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";

import { useDebouncedValue } from "../../lib/hooks/useDebouncedValue";
import { fetchProducts, type Product } from "../../lib/fetch-products";
import {
  createOrder as createOrderApi,
  type Order,
} from "../../lib/api/orders";

import {
  addItem,
  removeOne,
  removeItem,
  clearCart,
  selectItems,
  selectTotalPrice,
  selectTotalQuantity,
} from "../../lib/features/cartSlice";
import SearchBox from "./components/SearchBox";

export default function ProductCartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const dispatch = useDispatch();

  type Sort = "newest" | "price-asc" | "price-desc";

  const initialSort = (searchParams.get("sort") as ProductSort) ?? "newest";
  const [sort, setSort] = useState<ProductSort>(initialSort);

  // URL → UI
  const initialQuery = searchParams.get("q") ?? "";
  const initialFilter: "all" | "available" =
    searchParams.get("available") === "true" ? "available" : "all";

  // Search (debounced)
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebouncedValue(query, 300);

  // Filter
  const [filter, setFilter] = useState<"all" | "available">(initialFilter);

  // Redux
  const items = useSelector(selectItems);
  const totalPrice = useSelector(selectTotalPrice);
  const totalQuantity = useSelector(selectTotalQuantity);

  // Products (server-side filter + debounce)
  const {
    data,
    isLoading,
    isError: isProductsError,
    error: productsError,
    isFetching,
  } = useQuery({
    queryKey: qk.products(debouncedQuery, filter, sort),
    queryFn: ({ signal }) =>
      fetchProducts({
        q: debouncedQuery || undefined,
        available: filter === "available" ? true : undefined,
        sort,
        signal,
      }),

    // v5 جایگزین keepPreviousData:
    // placeholderData: (prev) => prev,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  // آرایهٔ امن برای TS
  const products = (data ?? []) as Product[];

  // UI → URL (فقط با مقدار debounce شده)
  useEffect(() => {
    const p = new URLSearchParams();

    const q = debouncedQuery.trim();
    if (q) p.set("q", q);

    if (filter === "available") p.set("available", "true");

    // sort را هم در URL نگه می‌داریم
    // پیشنهاد: اگر sort پیش‌فرض "newest" است، می‌تونی نذاری توی URL تا تمیزتر بماند
    p.set("sort", sort);

    const qs = p.toString();
    const nextUrl = qs ? `/product-cart?${qs}` : "/product-cart";

    // جلوگیری از replace بی‌دلیل (لوپ)
    const currentQs = searchParams.toString();
    if (qs === currentQs) return;

    router.replace(nextUrl, { scroll: false });
  }, [debouncedQuery, filter, sort, router, searchParams]);

  // Create Order (with precise cache updates)

  type SubmitOrderPayload = {
    items: Array<{ id: string; quantity: number; price: number }>;
    total: number;
  };

  type MutCtx = {
    // محصولات
    prevProductsQueries: Array<[QueryKey, Product[] | undefined]>;
    prevProductDetails: Array<[QueryKey, Product | undefined]>;
    orderedIds: string[];

    // سفارش‌ها
    prevOrders?: Order[];
    tempOrderId: string;
  };

  const { mutate: submitOrder, isPending } = useMutation<
    Order,
    Error,
    SubmitOrderPayload,
    MutCtx
  >({
    mutationFn: createOrderApi,

    // ✅ Optimistic update (الف): کالاهای داخل سفارش را موقتاً ناموجود کن
    onMutate: async (payload) => {
      // --- جلوگیری از overwrite شدن optimistic
      await qc.cancelQueries({ queryKey: ["products"] });
      await qc.cancelQueries({ queryKey: ["orders"] });

      // --- snapshot محصولات (همه حالت‌های ["products", q, filter])
      //از وضعیت فعلی snapshot می‌گیری (برای rollback)
      const prevProductsQueries = qc.getQueriesData<Product[]>({
        queryKey: ["products"],
      });

      const orderedIds = payload.items.map((i) => String(i.id));
      const prevProductDetails: Array<[QueryKey, Product | undefined]> =
        orderedIds.map((id) => {
          const key: QueryKey = qk.product(id);
          return [key, qc.getQueryData<Product>(key)]; //برای جزئیات محصول‌ها
        });

      // --- Optimistic محصولات: ناموجود کن
      //محصولات سفارش‌داده‌شده رو موقتاً available:false می‌کنی
      const idSet = new Set(orderedIds);

      qc.setQueriesData<Product[]>({ queryKey: ["products"] }, (old) => {
        if (!old) return old;
        return old.map((p) =>
          idSet.has(String(p.id)) ? { ...p, available: false } : p
        );
      });

      orderedIds.forEach((id) => {
        qc.setQueryData<Product>(qk.product(id), (old) =>
          old ? { ...old, available: false } : old
        );
      });

      // --- snapshot سفارش‌ها
      const prevOrders = qc.getQueryData<Order[]>(["orders"]);

      // --- Optimistic سفارش‌ها: یک سفارش موقت بساز و به انتهای لیست اضافه کن
      const tempOrderId = `temp-${Date.now()}`;
      const tempOrder: Order = {
        id: tempOrderId,
        items: payload.items,
        total: payload.total,
        createdAt: Date.now(),
      };

      //ک سفارش موقت می‌سازی و توی ["orders"] می‌گذاری
      qc.setQueryData<Order[]>(["orders"], (old) =>
        //  old ? [...old, tempOrder] : [tempOrder]
        old ? [tempOrder, ...old] : [tempOrder]
      );

      //و در آخر ctx برمی‌گردونی (چیزی که برای rollback لازم داری)
      return {
        prevProductsQueries,
        prevProductDetails,
        orderedIds,
        prevOrders,
        tempOrderId,
      };
    },

    onError: (_err, _payload, ctx) => {
      if (!ctx) return;
      //اگر سرور خطا بده، تو دقیقاً “عکس‌برداری‌ها” رو برمی‌گردونی

      // rollback محصولات
      ctx.prevProductsQueries.forEach(
        ([key, data]) => {
          qc.setQueryData(key, data);
        }
        //پس UI دقیقاً می‌ره به حالت قبل
      );
      ctx.prevProductDetails.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });

      // rollback سفارش‌ها
      if (typeof ctx.prevOrders === "undefined") {
        qc.removeQueries({ queryKey: ["orders"], exact: true });
      } else {
        qc.setQueryData(["orders"], ctx.prevOrders);
      }

      toast.error("Order failed — rolled back.");
    },

    //(تثبیت optimistic)
    onSuccess: (data, _vars, ctx) => {
      // جایگزینی سفارش موقت با سفارش واقعی
      if (ctx?.tempOrderId) {
        qc.setQueryData<Order[]>(["orders"], (old) => {
          if (!old) return old;
          return old.map((o) => (o.id === ctx.tempOrderId ? data : o));
        });
      }

      // کش جزئیات سفارش
      // qc.setQueryData(["order", data.id], data);
      qc.setQueryData(qk.order(data.id), data);

      // UI
      dispatch(clearCart());

      // sync با سرور (source of truth)
      //sync با سرور
      qc.invalidateQueries({ queryKey: qk.productsRoot() });
      qc.invalidateQueries({ queryKey: qk.ordersRoot() });

      toast.success(`Order registered (#${data.id}) 🎉`);
      router.push(`/orders/${data.id}`);
    },

    onSettled: (_data, _err, _payload, ctx) => {
      // جزئیات محصولات سفارش‌شده هم sync شود
      ctx?.orderedIds.forEach((id) => {
        qc.invalidateQueries({ queryKey: qk.product(id) });
      });
    },
  });

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          🛍️ فروشگاه من
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

      {/* نوار باریک هنگام refetch */}
      {isFetching && !isLoading && (
        <div className="sticky top-[64px] z-40 h-1 w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" />
      )}

      {/* Controls: Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-8 px-6">
        {/* <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جست‌وجو در محصولات…"
          className="w-full sm:w-96 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
        /> */}
        <SearchBox value={query} onChange={setQuery} />

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
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as ProductSort)}
          className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
        >
          <option value="newest">جدیدترین</option>
          <option value="price-asc">ارزان‌تر</option>
          <option value="price-desc">گران‌تر</option>
        </select>
      </div>

      {/* Body */}
      <div className="px-6 max-w-6xl mx-auto pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isProductsError ? (
          <ErrorState
            message={
              productsError instanceof Error
                ? productsError.message
                : "خطا در بارگذاری"
            }
          />
        ) : products.length === 0 ? (
          <EmptyState text="نتیجه‌ای با این فیلتر/جست‌وجو پیدا نشد." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                available={p.available}
                image={p.image}
                // onAddToCart={
                //   p.available
                //     ? () =>
                //         dispatch(
                //           addItem({
                //             id: p.id,
                //             name: p.name,
                //             price: p.price,
                //             image: p.image,
                //           })
                //         )
                //     : undefined
                // }
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart */}
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
