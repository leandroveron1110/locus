// src\app\(main)\business\[businessId]\page.tsx

import type { Metadata } from "next";
import BusinessProfile from "@/features/business/components/BusinessProfile";
import AppHeader from "@/features/header/components/AppHeader";
import { getBusinessData } from "@/lib/business";

type Props = {
  params: { businessId: string };
};


const DEFAULT_OG_IMAGE = "/locu-g.png"; 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const businessData = await getBusinessData(params.businessId); // LLAMADA 1

  const businessTitle = `${businessData.name} | Locus`;
  const businessDescription = businessData.shortDescription;
  const businessImage = businessData.logoUrl ?? DEFAULT_OG_IMAGE; 

  return {
    title: businessTitle,
    description: businessDescription,
    openGraph: {
      title: businessTitle,
      description: businessDescription,
      url: `https://locus-drab.vercel.app/business/${params.businessId}`,
      images: [
        {
          url: businessImage, // 👈 Imagen dinámica del negocio
          width: 1200,
          height: 630,
          alt: businessTitle,
        },
      ],
      // ... otros campos
    },
    // ... otros metadatos (twitter, icons, etc.)
  };
}

// ---
// 2. Componente de la página: Obtiene los datos para el contenido
// ---
export default async function BusinessPage({ params }: Props) {
  // LLAMADA 2: Usa la misma función. Gracias a la deduplicación, NO
  // se hace una segunda petición de red. Se reusa el resultado de la Llamada 1.
  const businessData = await getBusinessData(params.businessId);

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-100 w-full">
        <main className="w-full">
          <div className="bg-white w-full">
            {/* Ahora puedes pasar los datos completos a tu componente */}
            <BusinessProfile businessId={params.businessId} /> 
          </div>
        </main>
      </div>
    </>
  );
}