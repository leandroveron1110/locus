import { cache } from "react";

interface IBusinessOgData {
  name: string;
  description: string;
  imageUrl: string;
}

const DEFAULT_BUSINESS_DATA: IBusinessOgData = {
  name: "Locus | La plataforma de tu ciudad",
  description:
    "Locus es la plataforma que centraliza todos los negocios de tu ciudad. Encontrá todo lo que buscás y hacé tus pedidos online desde un solo lugar.",
  imageUrl: "/locu-g.png",
};

export const getBusinessData = cache(
  async (businessId: string): Promise<IBusinessOgData> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000); // ⏱️ 4 segundos máx.

      const res = await fetch(
        `https://locus-back.onrender.com/business/business/og-data/${businessId}`,
        {
          cache: "no-store",
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const data = await res.json();

      if (data?.data?.name) {
        return {
          name: data.data.name,
          description:
            data.data.description ||
            `Descubrí el perfil de ${data.data.name} y hacé tu pedido online fácilmente en Locus.`,
          imageUrl: data.data.imageUrl ?? DEFAULT_BUSINESS_DATA.imageUrl,
        };
      }

      // Si no vino nada útil del backend, usar valores por defecto
      return DEFAULT_BUSINESS_DATA;
    } catch (error) {
      return DEFAULT_BUSINESS_DATA;
    }
  }
);
