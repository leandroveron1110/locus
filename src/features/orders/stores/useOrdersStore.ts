import { create } from "zustand";
import { Order } from "../types/order";

interface OrdersState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({
    orders: [...state.orders, order]
  })),
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((o) =>
      o.id === orderId ? { ...o, status } : o
    )
  })),
}));
