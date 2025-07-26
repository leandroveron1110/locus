import axios from "@/lib/api";
import { Business } from "../types/business";

const baseUrlBusiness = "/businesses/"

export const fetchBusinessesByID = async (businessId: string): Promise<Business> => {
  const res = await axios.get(`${baseUrlBusiness}${businessId}`); // endpoint de tu API
  return res.data;
};

