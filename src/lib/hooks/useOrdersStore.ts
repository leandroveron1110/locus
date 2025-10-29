// src/stores/useUserOrdersStore.ts (Nuevo nombre para evitar confusiones)
import {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/features/orders/types/order";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserOrdersState {
  orders: Order[];
  lastSyncTime: string | undefined; // Propiedad de sincronización

  // SELECTORES (para useDataSync)
  getOrders: () => Order[];
  getLastSyncTime: () => string | undefined;

  // ACCIÓN DE SINCRONIZACIÓN (setSyncedItems equivalente)
  setSyncedOrders: (orders: Order[], latestTimestamp: string) => void;

  // ACCIONES DE MUTACIÓN (Funciones de UI existentes)
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  updatePaymentStatus: (
    orderId: string,
    newPaymentStatus: PaymentStatus,
    paymentReceiptUrl: string
  ) => void;
}

export const useUserOrdersStore = create<UserOrdersState>()(
  immer((set, get) => ({
    orders: [],
    lastSyncTime: undefined,

    // --- SELECTORES ---

    // Cumple con la firma necesaria (aunque ignoramos el 'id' del hook)
    getLastSyncTime: () => get().lastSyncTime,
    getOrders: () => get().orders,

    // --- ACCIÓN DE SINCRONIZACIÓN (setSyncedItems) ---

    setSyncedOrders: (orders, latestTimestamp) => {
      set((state) => {
        // La lista de órdenes ya viene fusionada (merged) del hook useDataSync.
        state.orders = orders;
        state.lastSyncTime = latestTimestamp;
      });
    },

    // --- ACCIONES DE MUTACIÓN (Existentes con Immer) ---

    addOrder: (order) =>
      set((state) => {
        // Agregar la nueva orden al inicio
        state.orders.unshift(order);
      }),

    updateOrderStatus: (orderId, newStatus) =>
      set((state) => {
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = newStatus as OrderStatus;
        }
      }),

    updatePaymentStatus: (orderId, newPaymentStatus, paymentReceiptUrl) =>
      set((state) => {
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.paymentStatus = newPaymentStatus;
          order.paymentReceiptUrl = paymentReceiptUrl;
        }
      }),
  }))
);
