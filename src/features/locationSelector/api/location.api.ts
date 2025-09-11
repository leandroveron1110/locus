import axios from "@/lib/api";
import { CreateAddress, FullAddress } from "../types/address-data";

export const fetchSaveAddressUser = async (body: CreateAddress): Promise<FullAddress> => {
  const { data } = await axios.post<FullAddress>(`/address`, body);
  return data;
};