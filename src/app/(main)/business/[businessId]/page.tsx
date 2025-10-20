import BusinessProfile from "@/features/business/components/BusinessProfile";
import AppHeader from "@/features/header/components/AppHeader";
import type { Metadata } from "next";
import { getBusinessData } from "@/lib/business";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessId: string }>;
}): Promise<Metadata> {
  const { businessId } = await params;
  const businessData = await getBusinessData(businessId);

  const title = businessData.name.includes("Locus")
    ? businessData.name
    : `${businessData.name} | Pedí online en Locus`;

  const description = businessData.description;
  const image = businessData.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://locus-drab.vercel.app/business/${businessId}`,
      siteName: "Locus",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@locus",
    },
  };
}


// ... (resto del componente BusinessPage)

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  return (
    <>
      <AppHeader />
      <div className="bg-white bg-gray-100">
        <BusinessProfile businessId={businessId} />
      </div>
    </>
  );
}
