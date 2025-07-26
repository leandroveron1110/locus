// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessesByID } from "../api/businessApi";

export const useBusinessProfile = (businessId: string) => {
  return useQuery({
    queryKey: ["business-profile", businessId],
    queryFn: () => fetchBusinessesByID(businessId),
    enabled: !!businessId, // solo si hay ID
  });
};
