"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders, type Order } from "../../lib/api/orders";

// Skeleton هم‌استایل با کارت جزئیات
function OrdersSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          سفارش‌ها
        </h2>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full text-right">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="p-3 border-b">شناسه</th>
              <th className="p-3 border-b">تعداد اقلام</th>
              <th className="p-3 border-b">جمع کل (تومان)</th>
              <th className="p-3 border-b">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
              >
                <td className="p-3 border-b">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
                <td className="p-3 border-b">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
                <td className="p-3 border-b">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
                <td className="p-3 border-b">
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

function formatDate(ts?: number) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("fa-IR");
}

export default function OrdersPage() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-4">
      {/* تیتر هم‌استایل با صفحهٔ جزئیات */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🧾 سفارش‌ها
        </h1>
        <button
          onClick={() => refetch()}
          className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isFetching ? "در حال به‌روزرسانی…" : "به‌روزرسانی"}
        </button>
      </div>

      {/* نوار باریک هنگام refetch (نه در بارگذاری اولیه) */}
      {isFetching && !isLoading && (
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse rounded" />
      )}

      {/* کارت محتوا: لودینگ → اسکلت | خطا → پیام | داده/خالی → جدول/پیام */}
      {isLoading ? (
        <OrdersSkeleton />
      ) : isError ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border p-4 text-red-600">
          {(error as Error)?.message ?? "خطا در دریافت سفارش‌ها"}
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border p-4">
          <p className="text-gray-500">هنوز سفارشی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border">
          {/* هدر کارت مثل صفحهٔ جزئیات */}
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              سفارش‌ها
            </h2>
          </div>

          {/* بدنه کارت */}
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full text-right">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="p-3 border-b">شناسه</th>
                  <th className="p-3 border-b">تعداد اقلام</th>
                  <th className="p-3 border-b">جمع کل (تومان)</th>
                  <th className="p-3 border-b">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((o) => (
                  <tr
                    key={o.id}
                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                  >
                    <td className="p-3 border-b">
                      <Link
                        href={`/orders/${o.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {o.id}
                      </Link>
                    </td>
                    <td className="p-3 border-b">
                      {o.items?.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="p-3 border-b">
                      {(o.total ?? 0).toLocaleString("fa-IR")}
                    </td>
                    <td className="p-3 border-b">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
