// src/features/orders/hooks/useCreateOrder.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyDelivery } from "../api/catalog-api";
import { CompanyDelivery, } from "../types/zone";
import { ApiResult } from "@/lib/apiFetch";

export const useCompanyDelivery = () => {
  return useQuery<ApiResult<CompanyDelivery[]>>({
    queryKey: ["campany-delivery"],
    queryFn: () => fetchCompanyDelivery(),
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
