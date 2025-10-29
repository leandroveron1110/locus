import { Order } from "@/features/orders/types/order";
import { useUserOrdersStore } from "./useOrdersStore";
import { syncOrdersByUserId } from "@/features/orders/api/order-api";
import { useUserDataSync } from "./useUserDataSync";

export function useFetchUserOrders(userId: string | undefined) {
  const store = useUserOrdersStore();

  return useUserDataSync<Order>({
    getLastSyncTime: () => store.getLastSyncTime(),
    getItems: () => store.getOrders(),

    setSyncedItems: (items, latestTimestamp) => {
      store.setSyncedOrders(items, latestTimestamp);
    },

    // ➡️ LLAMADA a la API. Pasamos el lastSyncTime.
    fetchUpdatedItems: async (lastSyncTime) => {
      if (!userId) {
        throw new Error("User ID is required for fetching user orders.");
      }
      const res = await syncOrdersByUserId(userId, lastSyncTime);

      return {
        items: res.newOrUpdatedOrders,
        latestTimestamp: res.latestTimestamp,
      };
    },

    entityName: "UserOrders",
  });
}
