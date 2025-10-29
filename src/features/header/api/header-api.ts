import { handleApiError } from "@/features/common/utils/handleApiError";
import { apiPost } from "@/lib/apiFetch";
import { INotification } from "@/types/notification";

// 💡 Define la estructura de la respuesta del backend
interface SyncNotificationUserResponse {
  notification: INotification[];
}

export const syncNotificationsUser = async (
  userId: string,
  lastSyncTime?: string
) => {
  try {
    // 💡 El endpoint es '/notifications/user/sync'
    const res = await apiPost<SyncNotificationUserResponse>(
      `orders/notifications/user/sync`,
      {
        userId,
        lastSyncTime,
      }
    );

    if (!res.success || !res.data) {
      throw handleApiError(
        res.error,
        "Error al sincronizar las notificaciones del usuario."
      );
    }

    // 💡 Devolvemos el array de notificaciones y el último timestamp
    return {
      notification: res.data.notification,
      latestTimestamp: res.timestamp, // Usando `res.timestamp` como en el ejemplo
    };
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "Error al intentar sincronizar las notificaciones del usuario."
    );
  }
};
