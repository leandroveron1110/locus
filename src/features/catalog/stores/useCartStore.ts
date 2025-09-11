import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Product } from "../types/catlog";

export type SelectedOption = {
  id: string;
  name: string;
  value: number;
};

export type CartItem = {
  cartItemId: string;
  product: Product;
  selectedOptions?: SelectedOption[];
  quantity: number;
};

interface CartState {
  items: ReadonlyArray<CartItem>;
  addToCart: (item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  editItem: (cartItemId: string, data: Partial<Omit<CartItem, "cartItemId">>) => void;
  clearCart: () => void;
  getTotal: () => number;
}

// ✅ Función utilitaria para comparar opciones
const areOptionsEqual = (a?: SelectedOption[], b?: SelectedOption[]) => {
  if (!a && !b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((opt) => b.some((bOpt) => bOpt.id === opt.id && bOpt.value === opt.value));
};

// ✅ Función utilitaria para calcular total de un item
const calculateItemTotal = (item: CartItem): number => {
  const basePrice = Number(item.product.finalPrice) || 0;
  const optionsTotal =
    item.selectedOptions?.reduce((acc, opt) => acc + (Number(opt.value) || 0), 0) ?? 0;

  return (basePrice + optionsTotal) * (Number(item.quantity) || 0);
};


export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (newItem) => {
    set((state) => {
      const existingItem = state.items.find(
        (i) =>
          i.product.id === newItem.product.id &&
          areOptionsEqual(i.selectedOptions, newItem.selectedOptions)
      );

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.cartItemId === existingItem.cartItemId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          ),
        };
      }

      const cartItem: CartItem = {
        ...newItem,
        cartItemId: uuid(),
      };

      return { items: [...state.items, cartItem] };
    });
  },

  removeItem: (cartItemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.cartItemId !== cartItemId),
    })),

  editItem: (cartItemId, data) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, ...data } : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotal: () => get().items.reduce((acc, item) => acc + calculateItemTotal(item), 0),
}));
