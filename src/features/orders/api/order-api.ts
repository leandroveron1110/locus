import axios from "@/lib/api";
import { CreateOrderFull, Order, PaymentMethodType, PaymentStatus } from "../types/order";
import { BusinessPaymentMethod } from "../types/business-payment-methods";


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

interface UpdatePaymentPayload {
  paymentType: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentReceiptUrl: string;
  paymentHolderName: string;
  paymentInstructions?: string;
}

export const fetchUpdatePayment = async (
  orderId: string,
  payload: UpdatePaymentPayload
) => {
  const { data } = await axios.patch(
    `/orders/order/payment/stauts/${orderId}`,
    { status: payload }
  );
  return data;
};


export const fetchBusinessPaymentMethodByBusinessID = async (
  businessId: string
): Promise<BusinessPaymentMethod[]> => {
  const res = await axios.get(`/business-payment-methods/business/${businessId}`); // endpoint de tu API
  
  return res.data;
};