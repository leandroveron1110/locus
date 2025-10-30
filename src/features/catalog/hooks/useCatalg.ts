// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCatalogByBusinessID } from "../api/catalog-api";
import { Menu } from "../types/catlog";
import { ApiError, ApiResult } from "@/types/api";

export const useCatalg = (businessId: string) => {
  return useQuery<ApiResult<Menu[]>, ApiError>({
    queryKey: ["menu-catalog", businessId],
    queryFn: () => fetchCatalogByBusinessID(businessId),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
