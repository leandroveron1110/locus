import axios from "@/lib/api";
import { Menu, Product } from "../types/catlog";
import { CreateOrderFull } from "../types/order";
import { Address, AddressCreateDto } from "../types/address";
import { CompanyDelivery, PriceZone } from "../types/zone";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { apiGet, apiPost, ApiResult } from "@/lib/apiFetch";

// 🟢 Menús y Productos
export const fetchCatalogByBusinessID = async (
  businessId: string
): Promise<ApiResult<Menu[]>> => {
  try {
    const data = await apiGet<Menu[]>(`/menus/business/${businessId}`);
    return data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      `Error al obtener el catálogo del negocio con ID ${businessId}`
    );
  }
};

export const fetchMenuProductDetailByProductId = async (
  productId: string
): Promise<ApiResult<Product>> => {
  try {
    const data = await apiGet<Product>(`/menu-products/product/${productId}`);
    return data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      `Error al obtener los detalles del producto con ID ${productId}`
    );
  }
};

// 🟢 Órdenes
export const fetchCreateOrder = async (payload: CreateOrderFull) => {
  try {
    await apiPost("/orders/full", payload);
  } catch (error: unknown) {
    throw handleApiError(
      error,
      `Error al crear la orden para el usuario ${payload.userId}`
    );
  }
};

// 🟢 Direcciones
export const fetchCreateAddress = async (
  payload: Address
): Promise<ApiResult<AddressCreateDto>> => {
  try {
    const data = await apiPost<AddressCreateDto>("/address", payload);
    return data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      `Error al crear la dirección para el usuario ${payload.userId}`
    );
  }
};

export const fetchUserAddresses = async (
  userId: string
): Promise<ApiResult<AddressCreateDto[]>> => {
  try {
    const data = await apiGet<AddressCreateDto[]>(`/address/user/${userId}`);
    return data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      `Error al obtener las direcciones del usuario con ID ${userId}`
    );
  }
};

// 🟢 Entregas / Zonas
export const fetchCalculatePriceZone = async (body: {
  companyId: string;
  lat: number;
  lng: number;
}): Promise<ApiResult<PriceZone>> => {
  try {
    const data = await apiPost<PriceZone>(
      `/delivery-zones/calculate-price`,
      body
    );
    return data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      `Error al calcular el precio de entrega para la compañía ${body.companyId}`
    );
  }
};

export const fetchCompanyDelivery = async (): Promise<
  ApiResult<CompanyDelivery[]>
> => {
  try {
    const data = await apiGet<CompanyDelivery[]>(`/delivery/companies`);
    return data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "Error al obtener la lista de compañías de entrega"
    );
  }
};
