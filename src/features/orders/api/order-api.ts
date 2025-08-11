import axios from "@/lib/api";
import { CreateOrderFull, Order } from "../types/order";


export const fetchCreateOrder = async (
  payload: CreateOrderFull
): Promise<any> => {
  const { data } = await axios.post("/orders/full", payload);
  return data;
};


export async function getUserOrders(userId: string): Promise<Order[]> {
  const res = await axios.get(`/orders/user/${userId}`);
  return res.data;
}

export async function createOrder(payload: Partial<Order>): Promise<Order> {
  const res = await axios.post(`orders`, payload);
  return res.data;
}
