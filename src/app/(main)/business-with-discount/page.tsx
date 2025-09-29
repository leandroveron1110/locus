"use client";

import { BusinessHeader } from "@/features/businessWithDiscount/components/BusinessHeader";
import { MenuSection } from "@/features/businessWithDiscount/components/MenuSection";
import { useBusinessWithDiscountData } from "@/features/businessWithDiscount/hooks/useBusinessWithDiscountData";

export default function BusinessPage() {
  const { data, isLoading, isError } = useBusinessWithDiscountData();

  if (isLoading || !data) return <p className="text-center py-6">Cargando...</p>;
  if (isError) return <p className="text-center py-6 text-red-500">Error al cargar datos</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-12">
      {data.map((business) => (
        <div key={business.id} className="space-y-8">
          <BusinessHeader business={business} />
          {business.menus.map((menu, idx) => (
            <div key={idx} className="space-y-6">
              {menu.sections.map((section) => (
                <MenuSection key={section.id} section={section} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
