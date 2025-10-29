import { useEffect } from "react";
import { Order, PaymentStatus } from "../types/order";
import { useUserSocket } from "@/lib/hooks/useUserSocket";
import { useUserOrdersStore } from "@/lib/hooks/useOrdersStore";

export function useUserOrdersSocket(userId: string) {
  const socket = useUserSocket(userId);

  const addOrder = useUserOrdersStore((s) => s.addOrder);
  const updateOrderStatus = useUserOrdersStore((s) => s.updateOrderStatus);
  const updatePaymentStatus = useUserOrdersStore((s) => s.updatePaymentStatus);

  useEffect(() => {
    if (!socket || !userId) return;

    const handleOrderCreated = (order: Order) => {
      addOrder(order);
    };

    const handleOrderStatusUpdated = (data: { orderId: string; status: string }) => {
      updateOrderStatus(data.orderId, data.status);
    };

    const handlePaymentUpdated = (data: {
      orderId: string;
      paymentStatus: PaymentStatus;
      paymentReceiptUrl: string;
    }) => {
      updatePaymentStatus(data.orderId, data.paymentStatus, data.paymentReceiptUrl);
    };

    socket.on("order_created", handleOrderCreated);
    socket.on("order_status_updated", handleOrderStatusUpdated);
    socket.on("payment_updated", handlePaymentUpdated);

    // 🔹 Limpieza al desmontar o cambiar de usuario/socket
    return () => {
      socket.off("order_created", handleOrderCreated);
      socket.off("order_status_updated", handleOrderStatusUpdated);
      socket.off("payment_updated", handlePaymentUpdated);
    };
  }, [socket, userId, addOrder, updateOrderStatus, updatePaymentStatus]);
}
