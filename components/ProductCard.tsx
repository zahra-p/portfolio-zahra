// <ProductCard name="کفش ورزشی" price={850000} available={true} />
"use client";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

//باید همه‌ی props رو به‌صورت یک آبجکت واحد دریافت کنی.
//React فقط یک آرگومان (props object) به کامپوننت می‌فرسته
//باید پارامتر رو به شکل آبجکت تعریف کنی (و بعد داخلش destructure کنی)
//در خط ({ name, price, available }: ProductCardProps) داریم props رو destructure می‌کنیم.
export default function ProductCard({
  id,
  name,
  price,
  available,
}: ProductCardProps) {
  return (
    <div className=" bg-gray-100 border-2 border-gray-500">
      <p>name: {name}</p>
      <p>price: {price}</p>
      <p>available: {available ? "✅" : "❌"}</p>
    </div>
  );
}
