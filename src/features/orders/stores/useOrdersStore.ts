// src/stores/useOrdersStore.ts
import { create } from "zustand";
import { Order, PaymentStatus } from "../types/order";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  setOrders: (orders: Order[]) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  updatePaymentStatus: (
    orderId: string,
    newPaymentStatus: PaymentStatus,
    paymentReceiptUrl: string
  ) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],

  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

  updateOrderStatus: (orderId, newStatus) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ),
    })),

  // Nueva función para actualizar el estado de pago
  updatePaymentStatus: (orderId, newPaymentStatus, paymentReceiptUrl) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              paymentStatus: newPaymentStatus,
              paymentReceiptUrl: paymentReceiptUrl,
            }
          : order
      ),
    })),
}));
