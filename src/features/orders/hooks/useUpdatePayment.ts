import { useMutation } from "@tanstack/react-query";
import { PaymentMethodType, PaymentStatus } from "../types/order";
import { fetchUpdatePayment } from "../api/order-api";

interface UpdatePaymentPayload {
  paymentType: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentReceiptUrl: string;
  paymentHolderName: string;
  paymentInstructions?: string;
}

export const useUpdatePayment = () => {
  return useMutation<any, Error, { orderId: string; payload: UpdatePaymentPayload }>({
    mutationFn: ({ orderId, payload }) => fetchUpdatePayment(orderId, payload),
  });
};
