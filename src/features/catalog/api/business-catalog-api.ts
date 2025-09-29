import { apiGet, ApiResult } from "@/lib/apiFetch";
import { Business } from "../types/business";
import { handleApiError } from "@/features/common/utils/handleApiError";

export const fetchBusinessID = async (
  businessId: string
): Promise<ApiResult<Business>> => {

  try {
    const res = await apiGet<Business>(`/business/business/porfile/${businessId}`); // endpoint de tu API
    
    return res;
    
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener el perfil del negocio")
  }
};