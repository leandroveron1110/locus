// src/features/locationSelector/hooks/useSaveAddress.ts
import { useMutation } from "@tanstack/react-query";
import { fetchSaveAddressUser } from "../api/location.api";
import { CreateAddress, FullAddress } from "../types/address-data";
import { ApiResult } from "@/lib/apiFetch";
import { ApiError } from "@/types/api";

export const useSaveAddress = () => {
  return useMutation<ApiResult<FullAddress>, ApiError, CreateAddress>({
    mutationFn: (body: CreateAddress) => fetchSaveAddressUser(body),
  });
};
