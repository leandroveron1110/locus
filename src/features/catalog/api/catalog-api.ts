import axios from "@/lib/api";
import { Menu } from "../types/catlog";

export const fetchCatalogByBusinessID = async (
  businessId: string
): Promise<Menu[]> => {
  const res = await axios.get(`/menus/business/${businessId}`); // endpoint de tu API
  return res.data;
};