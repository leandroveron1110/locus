import { apiGet } from "@/lib/apiFetch";
import { Business } from "../types/business";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { ApiResult } from "@/types/api";

export const fetchBusinessID = async (
  businessId: string
): Promise<ApiResult<Business>> => {
  try {
    const res = await apiGet<Business>(
      `/business/business/porfile/${businessId}`
    );

    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener el perfil del negocio");
  }
};
