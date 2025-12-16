// src/features/orders/hooks/useCompanyDelivery.ts

import { useQuery } from "@tanstack/react-query";
// Importar la nueva interfaz
import { CompanyDeliveryWithPrice } from "../types/zone";
import { apiPost } from "@/lib/apiFetch";
import { handleApiError } from "@/features/common/utils/handleApiError";

export const useCompanyDelivery = (lat: number | undefined, lng: number | undefined) => {
  return useQuery<CompanyDeliveryWithPrice[], unknown>({
    queryKey: ["company-delivery", lat, lng],
    queryFn: () => fetchCompanyDelivery(lat, lng),
    staleTime: 1000 * 60 * 60,
  });
};

export const fetchCompanyDelivery = async (
  lat: number | undefined,
  lng: number | undefined
): Promise<CompanyDeliveryWithPrice[]> => {
  try {
    if(!lat || !lng) {
      throw new Error(
      "Error al obtener la lista de compañías de entrega con precios"
    );
    }
    // Usamos apiPost y enviamos lat/lng en el body
    const res = await apiPost<CompanyDeliveryWithPrice[]>(`/delivery-zones/options`, {
      lat,
      lng,
    });
    if (!res.success || !res.data) {
      throw handleApiError(
        res.error,
        "Error al sincronizar las notificaciones del usuario."
      );
    }

    return res.data;
  } catch {
    // ... manejo de errores
    throw new Error(
      "Error al obtener la lista de compañías de entrega con precios"
    );
  }
};
