import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

export interface CartItem {
  id: string; // آیدی نهایی در استور: همیشه رشته
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<CartState>) {
      // بارگذاری از localStorage
      return action.payload || state;
    },

    // افزودن آیتم: ورودی باید با CartItem بدون quantity باشد (id می‌تواند string باشد)
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const id = String(action.payload.id); // اطمینان از string
      const exist = state.items.find((i) => i.id === id);
      if (exist) {
        exist.quantity += 1;
      } else {
        state.items.push({ ...action.payload, id, quantity: 1 });
      }
    },

    // کم کردن یک واحد از آیتم یا حذف اگر quantity به 1 برسد
    removeOne(state, action: PayloadAction<{ id: string | number }>) {
      const id = String(action.payload.id); // نرمال‌سازی
      const exist = state.items.find((i) => i.id === id);
      if (!exist) return;
      if (exist.quantity === 1) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        exist.quantity -= 1;
      }
    },

    // حذف کامل یک آیتم
    removeItem(state, action: PayloadAction<{ id: string | number }>) {
      const id = String(action.payload.id); // نرمال‌سازی
      state.items = state.items.filter((i) => i.id !== id);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { hydrate, addItem, removeOne, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

// Selectorها
//دقیقاً اینجا memoization اتفاق می‌افته
//این باعث می‌شه items به شکل پایدار برگرده (تا وقتی cart عوض نشده).
export const selectCartState = (s: { cart: CartState }) => s.cart;
export const selectItems = createSelector(
  [selectCartState],
  (cart) => cart.items
);

//یعنی reduce فقط وقتی اجرا می‌شه که items تغییر کنه.
export const selectTotalQuantity = createSelector([selectItems], (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0)
);

export const selectTotalPrice = createSelector([selectItems], (items) =>
  items.reduce((sum, i) => sum + i.quantity * i.price, 0)
);

//برای هر ProductCard یک selector جدا بسازی
//هر کارت فقط وقتی rerender بشه که quantity خودش عوض شده
//این selector جدید وقتی صدا زده شود، این کار را می‌کند:

//makeSelectQtyById() یک selector جدید می‌سازد (یک تابع)
//این selector جدید وقتی صدا زده شود، این کار را می‌کند:
//items را از Redux می‌گیرد
//id را هم می‌گیرد
//quantity همان آیتم را پیدا می‌کند و برمی‌گرداند
//پس خروجی makeSelectQtyById() اینه:
//✅ یک تابع selector مثل این:
//(state, id) => quantity
export const makeSelectQtyById = () =>
  createSelector(
    [selectItems, (_: any, id: string) => id],
    (items, id) => items.find((x) => x.id === id)?.quantity ?? 0
  );
