import { ApiErrorResponse } from "@/types/api";
import { AxiosError } from "axios";

export const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError && error.response?.data) {
    throw error.response.data as ApiErrorResponse;
  }
  throw new Error(defaultMessage);
};