import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Product } from "../types/catlog";

export type SelectedOption = {
  id: string;
  name: string;
  value: string;
};

export type CartItem = {
  cartItemId: string;
  product: Product;
  selectedOptions?: SelectedOption[];
  quantity: number;
};

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  editItem: (
    cartItemId: string,
    data: Partial<Omit<CartItem, "cartItemId">>
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (newItem) => {
    const existingItem = get().items.find(
      (i) =>
        i.product.id === newItem.product.id &&
        JSON.stringify(i.selectedOptions) ===
          JSON.stringify(newItem.selectedOptions)
    );

    if (existingItem) {
      set((state) => ({
        items: state.items.map((i) =>
          i.cartItemId === existingItem.cartItemId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        ),
      }));
    } else {
      const cartItem: CartItem = {
        ...newItem,
        cartItemId: uuid(),
      };
      set((state) => ({
        items: [...state.items, cartItem],
      }));
    }
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

  // ... the rest of your Zustand store

  getTotal: () =>
    get().items.reduce((acc, item) => {
      // 1. Get the base product price, defaulting to 0 if not a valid number
      const productPrice = parseFloat(String(item.product.finalPrice)) || 0;

      let itemTotal = productPrice * item.quantity;

      // 2. Sum the value of selected options
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        console.log(item.selectedOptions)
        const optionsTotal = item.selectedOptions.reduce(
          (optionsAcc, option) => {
            // Get the option value, defaulting to 0 if not a valid number
            const optionValue = parseFloat(option.value) || 0;
            return optionsAcc + optionValue;
          },
          0
        );
        itemTotal += optionsTotal * item.quantity;
      }

      // 3. Add the item's total to the accumulator
      return acc + itemTotal;
    }, 0),
}));
