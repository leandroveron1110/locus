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
  const businessData = await getBusinessData(businessId); // LLAMADA 1

  const businessTitle = `${businessData.name} | Locus`;
  const businessDescription = businessData.shortDescription;
  const businessImage = businessData.logoUrl ?? DEFAULT_OG_IMAGE;

  return {
    title: businessTitle,
    description: businessDescription,
    openGraph: {
      title: businessTitle,
      description: businessDescription,
      url: `https://locus-drab.vercel.app/business/${businessId}`,
      images: [
        {
          url: businessImage, // 👈 Imagen dinámica del negocio
          width: 1200,
          height: 630,
          alt: businessTitle,
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
