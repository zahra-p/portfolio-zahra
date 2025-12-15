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

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE}/orders`, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to load orders");
  return res.json();
}

export async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`${BASE}/orders/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to load order");
  return res.json();
}
