import { useEffect } from "react";
import { useUserNotificationsStore } from "./useUserNotificationsStore";
import { useUserSocket } from "./useUserSocket";
import { INotification } from "@/types/notification";

export function useUserNotificationsSocket(userId: string | undefined) {
  const socket = useUserSocket(userId);

  const addNotification = useUserNotificationsStore((s) => s.addNotification);

  const clearNotifications = useUserNotificationsStore(
    (s) => s.clearNotifications
  );

  useEffect(() => {
    if (!userId) {
      clearNotifications();
      return;
    }
    if (!socket) return; // esperar a que el socket esté disponible

    socket.on("user_order_notification", (data: INotification) => {
      addNotification(data);
    });

    return () => {
      socket.off("user_order_notification");
    };
  }, [socket, addNotification, userId, clearNotifications]); // businessId es una dependencia
}
