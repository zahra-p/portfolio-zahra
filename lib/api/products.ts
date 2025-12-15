// fetcher محصولات
export type Product = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  image: string;
};

const BASE = process.env.NEXT_PUBLIC_API ?? "http://localhost:4000";

// فقط fetcher (یک تابع async ساده) است.
// React Query از همین تابع به‌عنوان queryFn استفاده می‌کند.
export async function fetchProducts(): Promise<Product[]> {
  // از public سرو می‌شود، پس مستقیم قابل fetch است:
  // const res = await fetch("/shop/products.json", { cache: "no-store" });
  const res = await fetch(`${BASE}/products`, { cache: "no-store" });
  //{ cache: "no-store" }
  // به
  // fetch
  //  می‌گوید از کش مرورگر استفاده نکند؛ کش اصلی را
  // React Query
  // مدیریت می‌کند
  // (با queryKey، staleTime، …).
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
