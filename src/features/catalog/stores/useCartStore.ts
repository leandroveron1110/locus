import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Product } from "../types/catlog";
import { PaymentMethodType } from "@/features/orders/types/order";

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

interface PaymentBreakdown {
  cash: number;
  transfer: number;
  qr: number;
  total: number;
}

interface CartState {
  items: ReadonlyArray<CartItem>;
  addToCart: (item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  editItem: (
    cartItemId: string,
    data: Partial<Omit<CartItem, "cartItemId">>
  ) => void;
  clearCart: () => void;

  getTotal: () => number;
  getPaymentBreakdown: (
    customerSelectedMethod?: PaymentMethodType
  ) => PaymentBreakdown;
}

// ------------------------------------------
// Utilidades
// ------------------------------------------

const areOptionsEqual = (a?: SelectedOption[], b?: SelectedOption[]) => {
  if (!a && !b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((opt) =>
    b.some((bOpt) => bOpt.id === opt.id && bOpt.value === opt.value)
  );
};

const calculateItemTotal = (item: CartItem): number => {
  const basePrice = Number(item.product.finalPrice) || 0;
  const optionsTotal =
    item.selectedOptions?.reduce(
      (acc, opt) => acc + (Number(opt.value) || 0),
      0
    ) ?? 0;

  return (basePrice + optionsTotal) * (Number(item.quantity) || 0);
};

// ------------------------------------------
// STORE
// ------------------------------------------

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

  // TOTAL GENERAL
  getTotal: () =>
    get().items.reduce((acc, item) => acc + calculateItemTotal(item), 0),

  // ---------------------------------------
  // 🧮 DESGLOSE DE PAGOS
  // ---------------------------------------
  getPaymentBreakdown: (customerSelectedMethod?: PaymentMethodType | "qr") => {
    const items = get().items;

    let cash = 0;
    let transfer = 0;
    let qr = 0;

    for (const item of items) {
      const total = calculateItemTotal(item);
      const p = item.product;

      const canCash = p.acceptsCash;
      const canTransfer = p.acceptsTransfer;
      const canQr = p.acceptsQr;

      // -----------------------------------------------------------------
      // CASO 1 → El cliente eligió un método específico
      // -----------------------------------------------------------------
      if (customerSelectedMethod) {
        if (
          (customerSelectedMethod === PaymentMethodType.CASH && canCash) ||
          (customerSelectedMethod === PaymentMethodType.TRANSFER &&
            canTransfer) ||
          (customerSelectedMethod === "qr" && canQr)
        ) {
          // Va todo al método elegido
          if (customerSelectedMethod === PaymentMethodType.CASH) cash += total;
          if (customerSelectedMethod === PaymentMethodType.TRANSFER)
            transfer += total;
          if (customerSelectedMethod === "qr") qr += total;
        } else {
          // Si NO acepta el método elegido → va al método disponible del producto
          if (canTransfer) transfer += total;
          else if (canQr) qr += total;
          else cash += total;
        }

        continue;
      }

      // -----------------------------------------------------------------
      // CASO 2 → Sin preferencia del cliente (separar default por producto)
      // -----------------------------------------------------------------

      // SOLO CASH
      if (canCash && !canTransfer && !canQr) {
        cash += total;
        continue;
      }

      // SOLO TRANSFER
      if (!canCash && canTransfer && !canQr) {
        transfer += total;
        continue;
      }

      // SOLO QR
      if (!canCash && !canTransfer && canQr) {
        qr += total;
        continue;
      }

      // ACEPTA VARIOS → elegir uno con prioridad
      // Prioridad: TRANSFER → QR → CASH
      if (canTransfer) {
        transfer += total;
        continue;
      }

      if (canQr) {
        qr += total;
        continue;
      }

      // fallback
      cash += total;
    }

    return {
      cash,
      transfer,
      qr,
      total: cash + transfer + qr,
    };
  },
}));
