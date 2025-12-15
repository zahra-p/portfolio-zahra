import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
export const selectItems = (s: { cart: CartState }) => s.cart.items;
export const selectTotalQuantity = (s: { cart: CartState }) =>
  s.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectTotalPrice = (s: { cart: CartState }) =>
  s.cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
