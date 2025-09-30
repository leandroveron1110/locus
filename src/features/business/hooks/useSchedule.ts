// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchWeeklySchedule } from "../api/businessApi";
import { ApiResult } from "@/lib/apiFetch";
import { ApiError } from "@/types/api";

export const useSchedule = (businessId: string) => {
  return useQuery<ApiResult<Record<string, string[]>>, ApiError>({
    queryKey: ["business-schedule", businessId], // incluimos user?.id en la clave
    queryFn: () => fetchWeeklySchedule(businessId),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
