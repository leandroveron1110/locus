import BusinessProfile from "@/features/business/components/BusinessProfile";
import AppHeader from "@/features/header/components/AppHeader";
import type { Metadata } from "next";
import { getBusinessData } from "@/lib/business";

const DEFAULT_OG_IMAGE = "/locu-g.png";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessId: string }>;
}): Promise<Metadata> {
  const { businessId } = await params;
  const businessData = await getBusinessData(businessId);

  let title = "Locus";
  let description = "Locus es la plataforma que centraliza todos los negocios de tu ciudad. Encontrá todo lo que buscás y hacé tus pedidos online desde un solo lugar.";
  let image = DEFAULT_OG_IMAGE;

  if (businessData) {
    title = `${businessData.name} | Locus`;
    description = businessData.shortDescription ? businessData.shortDescription : "";
    image = businessData.logoUrl ?? DEFAULT_OG_IMAGE;
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://locus-drab.vercel.app/business/${businessId}`,
      images: [
        {
          url: image, // 👈 Imagen dinámica del negocio
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-100 w-full">
        <main className="w-full">
          <div className="bg-white w-full">
            <BusinessProfile businessId={businessId} />
          </div>
        </main>
      </div>
    </>
  );
}
