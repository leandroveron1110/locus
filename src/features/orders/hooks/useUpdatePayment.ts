import { useMutation } from "@tanstack/react-query";
import { PaymentMethodType, PaymentStatus } from "../types/order";
import { fetchUpdatePayment } from "../api/order-api";
import { Order } from "../types/order";

interface UpdatePaymentPayload {
  paymentType: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentReceiptUrl: string;
  paymentHolderName: string;
  paymentInstructions?: string;
}


export const useUpdatePayment = () => {
  return useMutation<Order, Error, { orderId: string; payload: UpdatePaymentPayload }>({
    mutationFn: ({ orderId, payload }) => fetchUpdatePayment(orderId, payload),
  });
};

