import { create } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  cart: Record<number, CartItem>;
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: {},

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart[product.id];

      return {
        cart: {
          ...state.cart,
          [product.id]: {
            ...product,
            quantity: existing ? existing.quantity + 1 : 1,
          },
        },
      };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const updated = { ...state.cart };

      if (!updated[id]) return state;

      if (updated[id].quantity === 1) {
        delete updated[id];
      } else {
        updated[id].quantity -= 1;
      }

      return { cart: updated };
    }),

  clearCart: () => set({ cart: {} }),
}));
