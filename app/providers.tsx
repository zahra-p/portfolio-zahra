"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../lib/store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { hydrate, selectItems } from "../lib/features/cartSlice";
import { Toaster } from "sonner";

function PersistGateClient({ children }: { children: ReactNode }) {
  // هیدرات از localStorage روی mount
  const dispatch = useDispatch();
  const items = useSelector(selectItems);

  // جلوگیری از دوباره‌هیدرات شدن در Dev/StrictMode
  const didHydrate = useRef(false);
  // فقط وقتی true شود ذخیره‌سازی فعال می‌شود
  const [isHydrated, setIsHydrated] = useState(false);

  // 1) فقط یک بار، localStorage را بخوان و هیدرات کن
  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;

    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("cart_state")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.cart?.items && Array.isArray(parsed.cart.items)) {
          dispatch(hydrate(parsed.cart)); // { items: [...] }
        }
      }
    } catch {}
    // مهم: بعد از تلاش برای hydrate، اجازهٔ ذخیره را فعال کن
    setIsHydrated(true);
  }, [dispatch]);

  // 2) فقط بعد از هیدرات، تغییرات را ذخیره کن
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave = JSON.stringify({ cart: { items } });
      localStorage.setItem("cart_state", stateToSave);
    } catch {}
  }, [items, isHydrated]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGateClient>{children}</PersistGateClient>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster richColors position="top-center" dir="rtl" /> {/* ⬅️ این */}
      </QueryClientProvider>
    </Provider>
  );
}
