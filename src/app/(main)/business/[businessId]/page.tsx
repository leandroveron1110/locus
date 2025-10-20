import BusinessProfile from "@/features/business/components/BusinessProfile";
import AppHeader from "@/features/header/components/AppHeader";
import type { Metadata } from "next";
import { getBusinessData } from "@/lib/business";

// const DEFAULT_OG_IMAGE = "/locu-g.png";
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ businessId: string }>;
// }): Promise<Metadata> {
//   const { businessId } = await params;
//   const businessData = await getBusinessData(businessId);

//   let title = "Locus | La plataforma de tu ciudad"; // Usa el título base
//   let description =
//     "Locus es la plataforma que centraliza todos los negocios de tu ciudad. Encontrá todo lo que buscás y hacé tus pedidos online desde un solo lugar."; // Usa la descripción base
//   let image = DEFAULT_OG_IMAGE;

//   // Lógica para usar datos del negocio si están disponibles
//   if (businessData && businessData.name) {
//     // Asegúrate de que businessData no sea nulo y tenga nombre
//     title = `${businessData.name} | Pedí online en Locus`;
//     // Asegúrate de que shortDescription exista, si no, usa una descripción del negocio,
//     // o usa la descripción base si es muy corta.
//     description =
//       businessData.description ||
//       `Descubrí el perfil de ${businessData.name} y hacé tu pedido online fácilmente en Locus.`;
//     image = businessData.imageUrl ?? DEFAULT_OG_IMAGE;
//   }

//   return {
//     // 1. Descripción general (para SEO/Google)
//     title: title,
//     description: description, // 👈 ¡Sobreescribe la descripción general!

//     // 2. OPEN GRAPH (para WhatsApp/Facebook)
//     openGraph: {
//       title: title,
//       description: description, // 👈 ¡Sobreescribe la descripción de OG!
//       url: `https://locus-drab.vercel.app/business/${businessId}`,
//       siteName: "Locus",
//       images: [
//         {
//           url: image,
//           width: 1200,
//           height: 630,
//           alt: title,
//         },
//       ],
//       type: "website",
//       locale: "es_AR",
//     },

//     // 3. TWITTER CARD (para Twitter/X)
//     twitter: {
//       card: "summary_large_image",
//       title: title,
//       description: description, // 👈 ¡Sobreescribe la descripción de Twitter!
//       images: [image],
//       creator: "@locus",
//     },
//   };
// }

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
