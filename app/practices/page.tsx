"use client";
import { useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function PracticesPage() {
  const [counter, setCounter] = useState(0);
  const products = [
    { id: "1", name: "sports shoes", price: 850000, available: true },
    { id: "2", name: "slippers", price: 20000, available: false },
    { id: "3", name: "Office shoes", price: 50000, available: false },
  ];

  // تعیین رنگ متن بر اساس مقدار counter
  const counterColor = counter < 0 ? "text-red-500" : "text-gray-700 ";

  return (
    // <main className="max-w-2xl mx-auto px-6 py-20">
    <main className=" mx-auto px-6 py-20">
      <div className="text-4xl font-bold text-center text-purple-500 mb-8">
        Practices
      </div>

      <p className="text-center mb-10 border-2 p-2">
        Dynamic class for{" "}
        <span className="text-red-700 font-bold">Counter</span> :{" "}
        <label
          // کلاس داینامیک
          //className={`${counterColor} ...`}
          className={`bg-yellow-100 border-4 font-bold p-2 rounded-md ${counterColor}`}
        >
          {counter}
        </label>
        <button
          className="bg-green-400 p-2 border-4 rounded-md ml-3"
          onClick={() => setCounter(counter + 1)}
        >
          +
        </button>
        <button
          className="bg-red-400 p-2 border-4 rounded-md "
          onClick={() => setCounter(counter - 1)}
        >
          -
        </button>
      </p>
      <div>
        Product Card Component
        {/* وقتی از 
        map 
        استفاده می‌کنی، باید به تابعش یه آرگومان (تابع) بدی
         که خودش پارامترها رو داخل پرانتز بگیره: */}
        {/* products.map((product, index) => { ... }) */}
        {/* از پرانتز () استفاده کردیم چون خروجی JSX داریم */}
        {products
          .filter((product) => product.available) // فقط محصولات موجود
          .map((product, index) => (
            <ProductCard
              id={product.id}
              key={index}
              name={product.name}
              price={product.price}
              available={product.available}
            />
          ))}
      </div>
    </main>
  );
}
