import { Product } from "@/features/catalog/types/catlog";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { apiGet, ApiResult } from "@/lib/apiFetch";

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
        products: response ? response : [],
        total: response ? response.length : 0
    }
  } catch (error: unknown) {
    throw handleApiError(error, `Error al traer los productos`);
  }
};
