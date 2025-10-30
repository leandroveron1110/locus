// src/features/search/api/searchApi.ts
import { apiGet } from "@/lib/apiFetch";
import { ISearchBusinessParams, ISearchBusiness } from "../types/search";
import { handleApiError } from "@/features/common/utils/handleApiError";

export const fetcSearchBusiness = async (params: ISearchBusinessParams) => {
  try {
    // 🌟 Usamos apiGet con el tipo esperado y los parámetros
    const response = await apiGet<ISearchBusiness>(`/search/businesses`, {
      params,
    });

    // Retornamos la estructura esperada por useSearchCacheSync
    return {
      result: response.data || {
        data: [],
        skip: 0,
        take: 0,
        total: 0,
      },
      latestTimestamp: response.timestamp,
    };
  } catch (error: unknown) {
    throw handleApiError(error, "Error al buscar negocios");
  }
};
