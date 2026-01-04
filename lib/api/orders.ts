//Search روی Orders (فقط با Order ID) + سینک با URL + سرور ساید

import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API ?? "http://localhost:4000";

export type Order = {
  id?: string;
  items: Array<{ id: string; quantity: number; price: number }>;
  total: number;
  createdAt?: number;
};

export async function createOrder(payload: Order) {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, createdAt: Date.now() }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Order failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${BASE}/orders/${params.id}`, { cache: "no-store" });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function fetchOrders(params: {
  page: number;
  limit: number;
  sort: "newest" | "oldest";
  q?: string;
  signal?: AbortSignal;
}): Promise<{ items: Order[]; totalCount: number }> {
  const { page, limit, sort, q, signal } = params;

  const sp = new URLSearchParams();
  sp.set("_page", String(page));
  sp.set("_limit", String(limit));
  sp.set("_sort", "createdAt");
  sp.set("_order", sort === "newest" ? "desc" : "asc");

  if (q?.trim()) sp.set("id_like", q.trim()); // سرچ فقط روی Order ID

  const res = await fetch(`${BASE}/orders?${sp.toString()}`, { signal });
  if (!res.ok) throw new Error("Failed to load orders");

  const totalCount = Number(res.headers.get("x-total-count") ?? "0");
  const items = (await res.json()) as Order[];
  return { items, totalCount };
}

export async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`${BASE}/orders/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to load order");
  return res.json();
}
