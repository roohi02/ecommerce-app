import { create } from "zustand";

type CartState = {
  cart: Record<number, number>;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: {},

  addToCart: (id) =>
    set((state) => ({
      cart: {
        ...state.cart,
        [id]: (state.cart[id] || 0) + 1,
      },
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: {
        ...state.cart,
        [id]: Math.max((state.cart[id] || 0) - 1, 0),
      },
    })),

  clearCart: () => set({ cart: {} }),

  totalItems: () =>
    Object.values(get().cart).reduce((a, b) => a + b, 0),
}));
