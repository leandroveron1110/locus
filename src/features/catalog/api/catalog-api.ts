import axios from "@/lib/api";
import { Menu, Product } from "../types/catlog";
import { CreateOrderFull } from "../types/order";
import { Address, AddressCreateDto } from "../types/address";
import { CompanyDelivery, PriceZone } from "../types/zone";

// 🟢 Menús y Productos
export const fetchCatalogByBusinessID = async (businessId: string): Promise<Menu[]> => {
  const { data } = await axios.get(`/menus/business/${businessId}`);
  return data;
};

export const fetchMenuProducDetaillByProductId = async (productId: string): Promise<Product> => {
  const { data } = await axios.get(`/menu-products/product/${productId}`);
  return data;
};

// 🟢 Órdenes
export const fetchCreateOrder = async (payload: CreateOrderFull) => {
  await axios.post("/orders/full", payload);
};

// 🟢 Direcciones
export const fetchCreateAddress = async (payload: Address): Promise<AddressCreateDto> => {
  const { data } = await axios.post("/address", payload);
  return data;
};

export const fetchUserAddresses = async (userId: string): Promise<AddressCreateDto[]> => {
  const { data } = await axios.get(`/address/user/${userId}`);
  return data;
};

// 🟢 Entregas / Zonas
export const fetchCalculatePriceZone = async (
  body: { companyId: string; lat: number; lng: number }
): Promise<PriceZone> => {
  const { data } = await axios.post<PriceZone>(`/delivery-zones/calculate-price`, body);
  return data;
};

export const fetchCompanyDelivery = async (): Promise<CompanyDelivery[]> => {
  const { data } = await axios.get(`/delivery/companies`);
  return data;
};
