import { useEffect } from "react";
import { useOrdersStore } from "../stores/useOrdersStore";
import { getUserOrders } from "../api/order-api";
import { initOrdersSocket } from "../sockets/orders-socket";
export function useOrders(userId: string) {
  const { orders, setOrders } = useOrdersStore();

  useEffect(() => {
    if (!userId) return;

    getUserOrders(userId).then((ordersFetch)=>{
      if(ordersFetch){
        setOrders(ordersFetch)
      }
    });
    initOrdersSocket(userId);
  }, [userId, setOrders]);

  return orders;
}

