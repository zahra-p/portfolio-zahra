// lib/queryKeys.ts
export type ProductSort = "newest" | "price-asc" | "price-desc";

// export const qk = {
//   productsRoot: () => ["products"] as const,
//   ordersRoot: () => ["orders"] as const,

//   products: (q: string, filter: "all" | "available", sort: ProductSort) =>
//     ["products", q, filter, sort] as const,

//   orders: () => ["orders"] as const,

//   product: (id: string | number) => ["product", String(id)] as const,
//   order: (id: string | number) => ["order", String(id)] as const,
// } as const;

export const qk = {
  // ریشه‌ها (برای invalidate کردن همه‌ی حالت‌ها)
  productsRoot: () => ["products"] as const,
  ordersRoot: () => ["orders"] as const,

  // لیست‌ها
  products: (q: string, filter: "all" | "available", sort: ProductSort) =>
    ["products", q, filter, sort] as const,
  orders: () => ["orders"] as const,

  // جزئیات
  product: (id: string | number) => ["product", String(id)] as const,
  order: (id: string | number) => ["order", String(id)] as const,
} as const;
