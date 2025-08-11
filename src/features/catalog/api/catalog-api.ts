import axios from "@/lib/api";
import { Menu, Product } from "../types/catlog";
import { CreateOrderFull } from "../types/order";
import { Address, AddressCreateDto } from "../types/address";

export const fetchCatalogByBusinessID = async (
  businessId: string
): Promise<Menu[]> => {
  const res = await axios.get(`/menus/business/${businessId}`); // endpoint de tu API
  return res.data;
};

export const fetchMenuProducDetaillByProductId = async (
  productId: string
): Promise<Product> => {
  const res = await axios.get(`/menu-products/product/${productId}`); // endpoint de tu API
  return res.data;
};

export const fetchCreateOrder = async (
  payload: CreateOrderFull
): Promise<any> => {
  const { data } = await axios.post("/orders/full", payload);
  return data;
};

export const fetchCreateAddress = async (
  payload: Address
): Promise<AddressCreateDto> => {
  const { data } = await axios.post("/address", payload);
  return data;
};

export const fetchUserAddresses = async (
  userId: string
): Promise<AddressCreateDto[]> => {
  const res = await axios.get(`/address/user/${userId}`);
  return res.data;
};
