import { useMutation } from "@tanstack/react-query";
import { PaymentMethodType, PaymentStatus } from "../types/order";
import { fetchUpdatePayment } from "../api/order-api";
import { Order } from "../types/order";
import { ApiError, ApiResult } from "@/types/api";

interface UpdatePaymentPayload {
  paymentType: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentReceiptUrl: string;
  paymentHolderName: string;
  paymentInstructions?: string;
}


export const useUpdatePayment = () => {
  return useMutation<ApiResult<Order>, ApiError, { orderId: string; payload: UpdatePaymentPayload }>({
    mutationFn: ({ orderId, payload }) => fetchUpdatePayment(orderId, payload),
  });
};

