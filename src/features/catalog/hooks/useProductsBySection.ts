// src/features/catalog/hooks/useProductsBySection.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProductsBySection, ProductPaginationResponse } from "../api/products-api";
import { ApiResult } from "@/lib/apiFetch";

interface UseProductsBySectionOptions {
  sectionId: string;
  pageSize?: number;
  offset?: number;
  enabled?: boolean;
}

export const useProductsBySection = ({
  sectionId,
  pageSize = 3,
  offset = 0,
  enabled = true,
}: UseProductsBySectionOptions) => {
  return useQuery<ApiResult<ProductPaginationResponse>, Error>({
    queryKey: ["products--section", sectionId, pageSize, offset],
    queryFn: () => fetchProductsBySection(sectionId, pageSize, offset),
    enabled: !!sectionId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
