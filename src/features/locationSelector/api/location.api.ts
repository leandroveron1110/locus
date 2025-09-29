import { CreateAddress, FullAddress } from "../types/address-data";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { apiPost, ApiResult } from "@/lib/apiFetch";

export const fetchSaveAddressUser = async (body: CreateAddress): Promise<ApiResult<FullAddress>> => {
  try {
    const data = await apiPost<FullAddress>(`/address`, body);
    return data;
    
  } catch (error: unknown) {
    throw handleApiError(error, "Error al guardar la ubicacion")
  }
};