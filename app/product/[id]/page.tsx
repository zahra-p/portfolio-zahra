"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProduct, Product } from "../../../lib/api/products";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addItem } from "../../../lib/features/cartSlice";
import { qk } from "../../../lib/queryKeys";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: qk.product(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  if (!id) return <p className="p-6 text-red-600">شناسه نامعتبر است</p>;
  if (isLoading) return <p className="p-6 text-gray-500">در حال بارگذاری…</p>;
  if (isError)
    return <p className="p-6 text-red-600">{(error as Error)?.message}</p>;

  const p = data as Product;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border overflow-hidden">
        <div className="relative w-full h-72">
          <Image src={p.image} alt={p.name} fill className="object-cover" />
        </div>
        <div className="p-6 space-y-3">
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {p.price.toLocaleString("fa-IR")} تومان
          </p>
          <p className={p.available ? "text-green-600" : "text-red-500"}>
            {p.available ? "✅ موجود" : "❌ ناموجود"}
          </p>

          <button
            disabled={!p.available}
            onClick={() =>
              dispatch(
                addItem({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                })
              )
            }
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </main>
  );
}
