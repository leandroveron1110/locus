// src/features/orders/hooks/useCreateOrder.ts
import { useMutation } from "@tanstack/react-query";
import { CreateOrderFull } from "../types/order";
import { fetchCreateOrder } from "../api/catalog-api";
import { ApiError } from "@/types/api";

export const useCreateOrder = () => {
  return useMutation<void, ApiError, CreateOrderFull>({
    mutationFn: fetchCreateOrder,
  });
};
