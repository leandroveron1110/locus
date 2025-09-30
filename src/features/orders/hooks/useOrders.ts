import { useEffect } from "react";
import { useOrdersStore } from "../stores/useOrdersStore";
import { getUserOrders } from "../api/order-api";
import { initOrdersSocket } from "../sockets/orders-socket";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
export function useOrders(userId: string) {
  const { orders, setOrders } = useOrdersStore();
  const { addAlert } = useAlert()

  useEffect(() => {
    if (!userId) return;

    getUserOrders(userId).then((ordersFetch)=>{
      if(ordersFetch){
        setOrders(ordersFetch)
      }
    }).catch(e=> {
      addAlert({
        message: getDisplayErrorMessage(e),
        type: 'error'
      })
    })
    initOrdersSocket(userId);
  }, [userId, setOrders, addAlert]);

  return orders;
}

