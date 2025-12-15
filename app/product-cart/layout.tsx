export const metadata = {
  title: "Storefront — Product Cart",
  description: "Demo storefront with product list, filters and cart.",
};

export default function ProductCartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </section>
  );
}
