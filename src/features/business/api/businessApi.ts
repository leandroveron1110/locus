import axios from "@/lib/api";
import { Business } from "../types/business";

const baseUrlBusiness = "/businesses/"

/**
 * Obtenemos el negocio
 */
export const fetchBusinessesByID = async (businessId: string, userId?: string): Promise<Business> => {
  const res = await axios.get(`${baseUrlBusiness}${businessId}/${userId ? userId : ""}`); // endpoint de tu API
  return res.data;
};

/**
 * Hace que un usuario siga un negocio.
 */
export const follow = async (userId: string, businessId: string): Promise<void> => {
  await axios.post(`${baseUrlBusiness}${businessId}/follow`, { userId });
};

/**
 * Hace que un usuario deje de seguir un negocio.
 */
export const unfollow = async (userId: string, businessId: string): Promise<void> => {
  await axios.delete(`${baseUrlBusiness}${businessId}/follow`, {
    data: { userId }, // axios usa `data` en DELETE requests con cuerpo
  });
};

