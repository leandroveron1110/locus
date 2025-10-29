// src/features/search/api/searchApi.ts
import { apiGet } from "@/lib/apiFetch";
import { ISearchBusinessParams, ISearchBusiness } from "../types/search";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { ApiResult } from "@/types/api";

export const fetcSearchBusiness = async (
  params?: ISearchBusinessParams
): Promise<ApiResult<ISearchBusiness>> => {
  try {
    const response = await apiGet<ISearchBusiness>(`/search/businesses`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al buscar negocios");
  }
};
