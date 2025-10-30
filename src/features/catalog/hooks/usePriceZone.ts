// src/features/orders/hooks/useCreateOrder.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCalculatePriceZone } from "../api/catalog-api";
import { PriceZone } from "../types/zone";
import { ApiError, ApiResult } from "@/types/api";

export const usePriceZone = (body?: {
  companyId: string;
  lat: number;
  lng: number;
}) => {
  return useQuery<ApiResult<PriceZone>, ApiError>({
    queryKey: ["price-zone", body],
    queryFn: () => fetchCalculatePriceZone(body!),
    enabled: Boolean(body?.companyId && body?.lat && body?.lng), // ✅ solo se ejecuta si hay datos válidos
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
  });
};

