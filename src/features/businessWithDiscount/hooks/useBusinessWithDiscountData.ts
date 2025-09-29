import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/api";

export interface MenuProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface MenuSection {
  id: string;
  name: string;
  products: MenuProduct[];
}

export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  menus: { sections: MenuSection[] }[];
}

export type BusinessResponse = Business[];

export const useBusinessWithDiscountData = () =>
  useQuery<BusinessResponse>({
    queryKey: ["business-data"],
    queryFn: async () => {
      const { data } = await axios.get("/menus/business-with-discount-products");

      return data.map((business: any) => ({
        id: business.id,
        name: business.name,
        logoUrl: business.logoUrl,
        description: business.description ?? "",
        menus: business.menus.map((menu: any) => ({
          sections: menu.sections.map((s: any) => ({
            id: s.id,
            name: s.name,
            products: s.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.finalPrice),
              imageUrl: p.imageUrl ?? undefined,
            })),
          })),
        })),
      }));
    },
  });
