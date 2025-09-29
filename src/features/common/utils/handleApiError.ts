import { ApiError, ApiResponse } from "@/types/api";
import { AxiosError } from "axios";

// Helper para validar si un objeto es tu ApiError de frontend
const isApiError = (e: any): e is ApiError =>
  typeof e === "object" &&
  e !== null &&
  "statusCode" in e &&
  "message" in e &&
  "path" in e;


export const handleApiError = (
  error: unknown,
  defaultMessage: string
): ApiError => {
  if (error instanceof AxiosError && error.response) {
    const apiResponseData: ApiResponse<unknown> = error.response.data;

    if (apiResponseData && apiResponseData.error) {
      const backendError = apiResponseData.error;

      if (isApiError(backendError)) {
        return backendError;
      }
    }

    return {
      statusCode: error.response?.status ?? 500,
      message: (apiResponseData as any)?.message || defaultMessage, 
      timestamp: new Date().toISOString(),
      path: error.config?.url ?? window.location.pathname,
    };
  }
  if (isApiError(error)) {
    return error;
  }

  return {
    statusCode: 500,
    message: defaultMessage,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };
};