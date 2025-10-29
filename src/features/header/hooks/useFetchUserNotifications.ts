import { useUserNotificationsStore } from "@/lib/hooks/useUserNotificationsStore";
import { syncNotificationsUser } from "../api/header-api";
import { INotification } from "@/types/notification";
import { useUserDataSync } from "@/lib/hooks/useUserDataSync";

export function useFetchUserNotifications(userId: string | undefined) {
  const store = useUserNotificationsStore();

  return useUserDataSync<INotification>({
    getLastSyncTime: store.getLastSyncTime,
    getItems: store.getNotifications,
    setSyncedItems: async (items, latestTimestamp) => {
      store.setSyncedNotifications(items, latestTimestamp);
    },
    fetchUpdatedItems: async (lastSyncTime) => {
      if (!userId) {
        throw new Error("User ID is required for fetching user orders.");
      }
      const res = await syncNotificationsUser(userId, lastSyncTime);
      return {
        items: res.notification,
        latestTimestamp: res.latestTimestamp,
      };
    },
    entityName: "UserNotifications",
  });
}
