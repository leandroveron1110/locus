// src/lib/business.ts

import { Business } from "@/features/business/types/business";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { cache } from "react";
import { ApiResult } from "./apiFetch";
import { ApiResponse } from "@/types/api";

export const getBusinessData = cache(
  async (businessId: string): Promise<ApiResult<Business>> => {
    try {
      const res = await fetch(
        `https://locus-back.onrender.com/business/business/og-data/${businessId}`,
        {
          cache: "no-store", // O la configuración de caché que prefieras
        }
      );

      const data: ApiResponse<ApiResult<Business>> = await res.json();

      return data.data;
    } catch (error: unknown) {
      throw handleApiError(
        error,
        "Error al obtener la información del negocio"
      );
    }
  }
);
