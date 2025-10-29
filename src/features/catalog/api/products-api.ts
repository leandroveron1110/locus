import { Product } from "@/features/catalog/types/catlog";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { apiGet } from "@/lib/apiFetch";
import { ApiResult } from "@/types/api";

export interface ProductPaginationResponse {
  products: Product[];
  total: number;
}

export const fetchProductsBySection = async (
  sectionId: string,
  limit: number,
  offset: number
): Promise<ApiResult<ProductPaginationResponse>> => {
  try {
    const response = await apiGet<ApiResult<Product[]>>(
      `/menu-products/sections/${sectionId}/products?limit=${limit}&offset=${offset}`
    );

    return {
        products: response.data ? response.data : [],
        total: response.data ? response.data.length : 0
    }
  } catch (error: unknown) {
    throw handleApiError(error, `Error al traer los productos`);
  }
};
