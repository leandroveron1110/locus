import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INotification } from "@/types/notification";

interface NotificationsState {
  /** 
   * 🧩 Datos sincronizados
   * Estos campos se actualizan desde el sistema de SyncTime
   * y reflejan la última versión confirmada desde el servidor.
   */
  notifications: INotification[];
  lastSyncTime?: string;

  /**
   * 🔁 Funciones utilizadas por el sistema de sincronización (useDataSync)
   * Estas funciones son las únicas que deberían ser llamadas
   * por el hook `useFetchUserNotifications` o similares.
   */
  getLastSyncTime: () => string | undefined;
  getNotifications: () => INotification[];
  setSyncedNotifications: (
    notifications: INotification[],
    latestTimestamp: string
  ) => void;

  /**
   * ⚙️ Funciones utilizadas por la aplicación (UI / tiempo real)
   * Estas se usan para mutaciones internas, por ejemplo:
   * - Recibir una notificación por socket
   * - Limpiar las notificaciones al cerrar sesión
   * - Filtrar por tipo, etc.
   */
  addNotification: (n: INotification) => void;
  clearNotifications: () => void;
  clearNotificationsByType: (type: string) => void;
}

export const useUserNotificationsStore = create<NotificationsState>()(
  immer((set, get) => ({
    notifications: [],
    lastSyncTime: undefined,

    // 🔍 SELECTORES
    getLastSyncTime: () => get().lastSyncTime,
    getNotifications: () => get().notifications,

    // 💾 Sincroniza el conjunto completo
    setSyncedNotifications: (notifications, latestTimestamp) => {
      set((state) => {
        state.notifications = notifications;
        state.lastSyncTime = latestTimestamp;
      });
    },

    // ➕ Agregar notificación nueva (sin duplicar)
    addNotification: (newNotification) =>
      set((state) => {
        const exists = state.notifications.some((n) => n.id === newNotification.id);
        if (!exists) {
          state.notifications.unshift(newNotification);
        }
      }),

    // 🧹 Limpiar todas
    clearNotifications: () =>
      set((state) => {
        state.notifications = [];
        state.lastSyncTime = undefined;
      }),

    // 🧩 Limpiar por tipo
    clearNotificationsByType: (typeToClear) =>
      set((state) => {
        state.notifications = state.notifications.filter((n) => n.type !== typeToClear);
      }),
  }))
);
