"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder, Order } from "../../../lib/api/orders";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id), // ← پاس دادن string
    enabled: !!id, // ← فقط بررسی تهی نبودن
    staleTime: 60_000,
  });

  if (!id) return <p className="p-6 text-red-600">شناسه نامعتبر است</p>;
  if (isLoading) return <p className="p-6 text-gray-500">در حال بارگذاری…</p>;
  if (isError)
    return <p className="p-6 text-red-600">{(error as Error)?.message}</p>;

  const order = data as Order;
  const totalQty = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">جزئیات سفارش {order.id}</h1>
        <button
          onClick={() => router.push("/orders")}
          className="text-blue-600 hover:underline"
        >
          ← بازگشت به سفارش‌ها
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border">
        <div className="p-4 border-b dark:border-gray-700">
          <p>
            تعداد اقلام: <b>{totalQty}</b>
          </p>
          <p>
            جمع کل: <b>{(order.total ?? 0).toLocaleString("fa-IR")} تومان</b>
          </p>
          <p>
            تاریخ:{" "}
            <b>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("fa-IR")
                : "-"}
            </b>
          </p>
        </div>

        <div className="p-4">
          {!order.items || order.items.length === 0 ? (
            <p className="text-gray-500">آیتمی در این سفارش نیست.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-right">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="p-3 border-b">شناسه محصول</th>
                    <th className="p-3 border-b">تعداد</th>
                    <th className="p-3 border-b">قیمت واحد</th>
                    <th className="p-3 border-b">قیمت کل</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it) => (
                    <tr
                      key={it.id}
                      className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900"
                    >
                      <td className="p-3 border-b">{it.id}</td>
                      <td className="p-3 border-b">{it.quantity}</td>
                      <td className="p-3 border-b">
                        {it.price.toLocaleString("fa-IR")} تومان
                      </td>
                      <td className="p-3 border-b">
                        {(it.price * it.quantity).toLocaleString("fa-IR")} تومان
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
