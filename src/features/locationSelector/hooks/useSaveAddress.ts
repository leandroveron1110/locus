// src/features/locationSelector/hooks/useSaveAddress.ts
import { useMutation } from "@tanstack/react-query";
import { fetchSaveAddressUser } from "../api/location.api";
import { CreateAddress, FullAddress } from "../types/address-data";

export const useSaveAddress = () => {
  return useMutation<FullAddress, Error, CreateAddress>({
    mutationFn: (body: CreateAddress) => fetchSaveAddressUser(body),
  });
};
