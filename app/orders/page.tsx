"use client";

import Link from "next/link";
import OrdersSearchBox from "./components/OrdersSearchBox";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "../../lib/hooks/useDebouncedValue";
import { fetchOrders, type Order } from "../../lib/api/orders";

function formatDate(ts?: number) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("en-US");
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US");
}

function clampInt(v: string | null, fallback: number, min = 1) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return i < min ? fallback : i;
}

function OrdersSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[14%]" />
            <col className="w-[24%]" />
            <col className="w-[40%]" />
          </colgroup>

          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {["Order ID", "Items", "Total", "Date"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900"
              >
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- URL → State (initial)
  const initialQuery = searchParams.get("q") ?? "";
  const initialSort: "newest" | "oldest" =
    searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  const initialPage = clampInt(searchParams.get("page"), 1, 1);
  const initialLimit = clampInt(searchParams.get("limit"), 10, 1);
  const normalizedInitialLimit = [10, 20, 50].includes(initialLimit)
    ? initialLimit
    : 10;

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebouncedValue(query, 300);

  const [sort, setSort] = useState<"newest" | "oldest">(initialSort);

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState<number>(normalizedInitialLimit);

  // --- Back/Forward: URL → State
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const s: "newest" | "oldest" =
      searchParams.get("sort") === "oldest" ? "oldest" : "newest";

    const p = clampInt(searchParams.get("page"), 1, 1);
    const l0 = clampInt(searchParams.get("limit"), 10, 1);
    const l = [10, 20, 50].includes(l0) ? l0 : 10;

    setQuery(q);
    setSort(s);
    setPage(p);
    setLimit(l);
  }, [searchParams]);

  // --- React Query
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<{
    items: Order[];
    totalCount: number;
  }>({
    queryKey: ["orders", page, limit, sort, debouncedQuery],
    queryFn: ({ signal }) =>
      fetchOrders({ page, limit, sort, q: debouncedQuery, signal }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const orders = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // اگر کاربر رفت به page بزرگ‌تر از totalPages (مثلاً بعد از سرچ)، برگردان
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // وقتی سرچ/سورت/لیمیت تغییر می‌کند بهتره page برگرده 1
  useEffect(() => setPage(1), [debouncedQuery, sort, limit]);

  // --- State → URL (sync)
  useEffect(() => {
    const p = new URLSearchParams();

    const q = debouncedQuery.trim();
    if (q) p.set("q", q);

    if (sort === "oldest") p.set("sort", "oldest"); // newest default

    if (page !== 1) p.set("page", String(page));
    if (limit !== 10) p.set("limit", String(limit));

    const nextQs = p.toString();
    const currentQs = searchParams.toString();
    if (nextQs === currentQs) return;

    router.replace(nextQs ? `/orders?${nextQs}` : "/orders", { scroll: false });
  }, [debouncedQuery, sort, page, limit, router, searchParams]);

  // --- Summary cards (اختیاری: چون شما قبلاً گذاشتی، اینجا هم نگه می‌داریم)
  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const totalItems = orders.reduce(
      (sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) ?? 0),
      0
    );
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
    const lastCreatedAt =
      orders.length > 0
        ? Math.max(...orders.map((o) => o.createdAt ?? 0))
        : undefined;

    return { totalOrders, totalItems, totalRevenue, lastCreatedAt };
  }, [orders]);

  const showingFrom = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = totalCount === 0 ? 0 : Math.min(page * limit, totalCount);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="ltr">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Orders
              </h1>
              <p className="text-sm text-gray-500">
                View and manage registered orders
              </p>
            </div>

            {/* Controls wrapper */}
            <div className="w-full lg:w-auto">
              {/* Row 1: Search + Sort + Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(280px,1fr)_auto_auto] gap-3 items-center">
                {/* Search */}
                <div className="sm:col-span-2 lg:col-span-1 min-w-0">
                  <OrdersSearchBox value={query} onChange={setQuery} />
                </div>

                {/* Sort */}
                {/* Sort */}
                <div className="shrink-0 inline-flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSort("newest")}
                    aria-pressed={sort === "newest"}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap flex-1 sm:flex-none ${
                      sort === "newest"
                        ? "bg-purple-600 text-white shadow"
                        : "text-gray-700 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-900/40"
                    }`}
                  >
                    Newest
                  </button>

                  <button
                    type="button"
                    onClick={() => setSort("oldest")}
                    aria-pressed={sort === "oldest"}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap flex-1 sm:flex-none ${
                      sort === "oldest"
                        ? "bg-purple-600 text-white shadow"
                        : "text-gray-700 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-900/40"
                    }`}
                  >
                    Oldest
                  </button>
                </div>

                {/* Limit */}
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="shrink-0 w-full sm:w-auto px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>

              {/* Row 2: Pagination + Actions */}
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Pagination */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={page <= 1 || isFetching}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-2 text-sm border rounded-xl disabled:opacity-50 whitespace-nowrap"
                  >
                    Prev
                  </button>

                  <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    Page <b>{page}</b> / <b>{totalPages}</b>
                    <span className="mx-2 text-gray-400">•</span>
                    Showing <b>{showingFrom}</b>–<b>{showingTo}</b> of{" "}
                    <b>{totalCount}</b>
                  </div>

                  <button
                    disabled={page >= totalPages || isFetching}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-2 text-sm border rounded-xl disabled:opacity-50 whitespace-nowrap"
                  >
                    Next
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => refetch()}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl
              hover:bg-gray-100 dark:hover:bg-gray-800 transition whitespace-nowrap"
                  >
                    {isFetching ? "Refreshing…" : "Refresh"}
                  </button>

                  <Link
                    href="/product-cart"
                    className="px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700
              hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center whitespace-nowrap"
                  >
                    Store
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Thin refetch bar */}
          {isFetching && !isLoading && (
            <div className="mt-4 h-1 w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse rounded" />
          )}
        </div>

        {/* Summary */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total orders (this page)
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {summary.totalOrders.toLocaleString("en-US")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total items (this page)
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {summary.totalItems.toLocaleString("en-US")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Revenue (Toman) (this page)
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatMoney(summary.totalRevenue)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest order (this page)
              </p>
              <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                {summary.lastCreatedAt
                  ? formatDate(summary.lastCreatedAt)
                  : "-"}
              </p>
            </div>
          </div>
        )}

        {/* States */}
        {isLoading && <OrdersSkeleton />}

        {isError && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900 p-5">
            <p className="text-red-600">
              {(error as Error)?.message ?? "Failed to load orders"}
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <p className="text-gray-500">No orders yet.</p>
                <Link
                  href="/product-cart"
                  className="underline text-blue-600 mt-2 inline-block"
                >
                  Go to store
                </Link>
              </div>
            ) : (
              <div
                className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden ${
                  isFetching ? "opacity-90" : ""
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 dark:text-gray-100">
                    Orders List
                  </h2>
                  {isFetching && (
                    <span className="text-xs text-gray-500">Updating…</span>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed text-left">
                    <colgroup>
                      <col className="w-[22%]" />
                      <col className="w-[14%]" />
                      <col className="w-[24%]" />
                      <col className="w-[40%]" />
                    </colgroup>

                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          Order ID
                        </th>
                        <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          Items
                        </th>
                        <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          Total
                        </th>
                        <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((o) => {
                        const itemsCount =
                          o.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

                        return (
                          <tr
                            key={o.id}
                            onClick={() => router.push(`/orders/${o.id}`)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                router.push(`/orders/${o.id}`);
                            }}
                            role="link"
                            tabIndex={0}
                            className="cursor-pointer odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900
                                       hover:bg-purple-50 dark:hover:bg-gray-700/40 transition outline-none"
                          >
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-mono">
                              {o.id}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                              {itemsCount}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold">
                              {formatMoney(o.total ?? 0)}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                              {formatDate(o.createdAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
