// sockets/order-socket.ts
import { io, Socket } from "socket.io-client";
import { Order, PaymentStatus } from "../types/order";
import { useOrdersStore } from "../stores/useOrdersStore";

let socket: Socket | null = null;

export function initOrdersSocket(userId: string) {
  if (!userId) {
    console.warn("initOrdersSocket llamado sin userId");
    return null;
  }

  if (socket) {
    console.log("Socket de usuario ya inicializado");
    return socket;
  }

  const { addOrder, updateOrderStatus, updatePaymentStatus } =
    useOrdersStore.getState();

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Conectado al socket como user", socket!.id);
    socket!.emit("join_role", { role: "user", id: userId });
  });

  socket.on("order_created", (order: Order) => {
    console.log("Nueva orden recibida:", order);
    addOrder(order);
  });

  socket.on(
    "order_status_updated",
    (data: { orderId: string; status: string }) => {
      console.log("Estado de orden actualizado:", data);
      updateOrderStatus(data.orderId, data.status);
    }
  );

  socket.on(
    "payment_updated",
    (data: {
      orderId: string;
      paymentStatus: string;
      paymentReceiptUrl: string;
    }) => {
      console.log("Estado de pago actualizado:", data);
      updatePaymentStatus(
        data.orderId,
        data.paymentStatus as PaymentStatus,
        data.paymentReceiptUrl
      );
    }
  );

  return socket;
}

export function getOrdersSocket() {
  return socket;
}
