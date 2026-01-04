"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder, type Order } from "../../../lib/api/orders";
import { fetchProducts, type Product } from "../../../lib/fetch-products";
import { qk } from "../../../lib/queryKeys";

function formatDate(ts?: number) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("en-US");
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US");
}

function DetailSkeleton() {
  return (
    <div className="space-y-4" dir="ltr">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-44 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
          >
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="mt-2 h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="h-11 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" />
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // 1) Load order
  const orderQ = useQuery<Order>({
    queryKey: qk.order(id),
    queryFn: () => fetchOrder(id),
    enabled: !!id,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  // 2) Load products (for name lookup)
  const productsQ = useQuery<Product[]>({
    queryKey: qk.products("", "all", "newest"),
    queryFn: ({ signal }) => fetchProducts({ signal }),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const productById = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of productsQ.data ?? []) map.set(String(p.id), p);
    return map;
  }, [productsQ.data]);

  const summary = useMemo(() => {
    const order = orderQ.data;
    const totalQty = order?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    const total = order?.total ?? 0;
    const createdAt = order?.createdAt;
    return { totalQty, total, createdAt };
  }, [orderQ.data]);

  if (!id) {
    return (
      <div
        dir="ltr"
        className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900 p-5"
      >
        <p className="text-red-600">Invalid order id.</p>
        <Link
          href="/orders"
          className="underline text-blue-600 mt-2 inline-block"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  if (orderQ.isLoading) return <DetailSkeleton />;

  if (orderQ.isError) {
    return (
      <div
        dir="ltr"
        className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900 p-5"
      >
        <p className="text-red-600">
          {(orderQ.error as Error)?.message ?? "Failed to load order"}
        </p>
        <button
          onClick={() => router.push("/orders")}
          className="mt-3 px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>
    );
  }

  const order = orderQ.data as Order;

  return (
    <main className="space-y-6" dir="ltr">
      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Order Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Order ID:{" "}
              <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                {order.id}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/orders")}
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              ← Back
            </button>
            <Link
              href="/product-cart"
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-xl
                         bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Store
            </Link>
          </div>
        </div>

        {orderQ.isFetching && (
          <div className="mt-3 h-1 w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse rounded" />
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {summary.totalQty.toLocaleString("en-US")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total (Toman)
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatMoney(summary.total ?? 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">
            {formatDate(summary.createdAt)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
          <p className="mt-1 text-base font-semibold font-mono text-gray-900 dark:text-gray-100">
            {order.id}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">
            Order Items
          </h2>
          {productsQ.isFetching && (
            <span className="text-xs text-gray-500">Updating products…</span>
          )}
        </div>

        <div className="p-4">
          {!order.items || order.items.length === 0 ? (
            <p className="text-gray-500">No items in this order.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* 🔧 Fix alignment: table-fixed + colgroup + same paddings */}
              <table className="w-full table-fixed text-left">
                <colgroup>
                  <col className="w-[42%]" />
                  <col className="w-[14%]" />
                  <col className="w-[20%]" />
                  <col className="w-[24%]" />
                </colgroup>

                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      Product
                    </th>
                    <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      Qty
                    </th>
                    <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      Line Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((it) => {
                    const p = productById.get(String(it.id));
                    const name = p?.name ?? "Unknown product";

                    return (
                      <tr
                        key={it.id}
                        className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900 hover:bg-purple-50 dark:hover:bg-gray-700/40 transition"
                      >
                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {name}
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">
                            ID: {String(it.id)}
                          </div>
                        </td>

                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {it.quantity}
                        </td>

                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          {formatMoney(it.price)}
                        </td>

                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold">
                          {formatMoney(it.price * it.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
