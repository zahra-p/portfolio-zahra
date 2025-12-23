export type Sort = "newest" | "price-asc" | "price-desc";

export type Product = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  image: string;
};

const BASE = process.env.NEXT_PUBLIC_API ?? "http://localhost:4000";

type Params = {
  q?: string;
  available?: boolean;
  signal?: AbortSignal;
};

export async function fetchProducts(opts: {
  q?: string;
  available?: boolean;
  sort?: Sort;
  signal?: AbortSignal;
}): Promise<Product[]> {
  const params = new URLSearchParams();

  if (opts.q) params.set("name_like", opts.q);
  if (typeof opts.available === "boolean")
    params.set("available", String(opts.available));

  // ✅ Server-side sort
  const sort = opts.sort ?? "newest";
  if (sort === "newest") {
    params.set("_sort", "createdAt");
    params.set("_order", "desc");
  } else {
    params.set("_sort", "price");
    params.set("_order", sort === "price-asc" ? "asc" : "desc");
  }

  const res = await fetch(`${BASE}/products?${params.toString()}`, {
    signal: opts.signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error("failed to load products");
  return res.json();
}

// React Query
// فقط مدیریت کش/لودینگ/ریفِچ رو انجام می‌ده؛
// اجرای واقعی درخواست رو همین تابع انجام می‌ده.

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to load product");
  return res.json();
}
