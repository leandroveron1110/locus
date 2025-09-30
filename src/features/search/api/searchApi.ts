// src/features/search/api/searchApi.ts
import { apiGet, ApiResult } from "@/lib/apiFetch";
import { ISearchBusinessParams, ISearchBusiness } from "../types/search";
import { handleApiError } from "@/features/common/utils/handleApiError";

export const fetcSearchBusiness = async (
  params?: ISearchBusinessParams
): Promise<ApiResult<ISearchBusiness>> => {
  try {
    const response = await apiGet<ISearchBusiness>(`/search/businesses`, {
      params,
    });
    return response;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al buscar negocios");
  }
};
