import { Order, PaymentMethodType, PaymentStatus } from "../types/order";
import { BusinessPaymentMethod } from "../types/business-payment-methods";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { apiGet, apiPatch, apiPost, ApiResult } from "@/lib/apiFetch";

// ===========================
// 🟩 Obtener órdenes de un usuario
// ===========================
export async function getUserOrders(userId: string): Promise<ApiResult<Order[]>> {
  try {
    const res = await apiGet<Order[]>(`/orders/user/${userId}`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al buscar las órdenes del usuario");
  }
}

// ===========================
// 🟩 Crear una orden
// ===========================
export async function createOrder(payload: Partial<Order>): Promise<ApiResult<Order>> {
  try {
    const res = await apiPost<Order>(`/orders`, payload);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al crear la orden");
  }
}

interface UpdatePaymentPayload {
  paymentType: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentReceiptUrl: string;
  paymentHolderName: string;
  paymentInstructions?: string;
}

export async function fetchUpdatePayment(
  orderId: string,
  payload: UpdatePaymentPayload
): Promise<ApiResult<Order>> {
  try {
    const res = await apiPatch<Order>(
      `/orders/order/payment/status/${orderId}`,
      {status: payload}
    );
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar el pago de la orden");
  }
}

// ===========================
// 🟩 Obtener métodos de pago de un negocio
// ===========================
export async function fetchBusinessPaymentMethodByBusinessID(
  businessId: string
): Promise<ApiResult<BusinessPaymentMethod[]>> {
  try {
    const res = await apiGet<BusinessPaymentMethod[]>(
      `/business-payment-methods/business/${businessId}`
    );
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los métodos de pago del negocio");
  }
}
