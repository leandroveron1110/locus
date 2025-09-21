// src/features/business/components/BusinessProfile.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { withSkeleton } from "@/features/common/utils/withSkeleton";

import { SkeletonCategories } from "./components/Skeleton/SkeletonCategories";
import { SkeletonSchedule } from "./components/Skeleton/SkeletonSchedule";
import { SkeletonGallery } from "./components/Skeleton/SkeletonGallery";

import Rating from "./components/Rating";
import BusinessContactInfo from "./components/BusinessContactInfo";
import BusinessHeader from "./components/BusinessHeader";

import ProfileNav from "./components/ProfileNav";
import { BusinessProfileSkeleton } from "./components/Skeleton/BusinessProfileSkeleton";

interface Props {
  businessId: string;
}

const LazyCategoriesTags = withSkeleton(
  () => import("./components/CategoriesTags"),
  SkeletonCategories
);
const LazySchedule = withSkeleton(
  () => import("./components/Schedule"),
  SkeletonSchedule
);
const LazyGallery = withSkeleton(
  () => import("./components/Gallery"),
  SkeletonGallery
);

export default function BusinessProfile({ businessId }: Props) {
  const router = useRouter();
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);

  const [activeSection, setActiveSection] = useState<string>("gallery");

  if (isLoading) {
    // ⬅️ Usamos el componente de esqueleto en lugar del texto
    return <BusinessProfileSkeleton />; 
  }

  if (isError)
    return (
      <p
        role="alert"
        className="text-center text-red-600 mt-12 text-lg font-semibold"
      >
        Error: {(error as Error).message}
      </p>
    );

  if (!data) return null;

  const hasMenu = data.modulesConfig.menu?.enabled ?? false;

  const handleGoToMenu = () => {
    router.push(`/business/${businessId}/catalog`);
  };

  return (
    <main className="pb-25">
      {/* Header que ocupa todo el ancho en móvil */}
      <div className="mb-8"> {/* Agrega un margen inferior para separar del contenido */}
        <BusinessHeader
          fullDescription={`${data.fullDescription ?? data.shortDescription}`}
          logoUrl={data.logoUrl}
          name={data.name}
          businessId={data.id}
        />
      </div>

      {/* Contenido principal con márgenes */}
      <section className="px-4 max-w-6xl mx-auto space-y-10">
        {/* Botón de catálogo */}
        {hasMenu && (
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-6 px-4 sm:px-0">
            <button
              onClick={handleGoToMenu}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition"
            >
              Catálogo
            </button>
          </div>
        )}

        {/* Tabs estilo Instagram */}
        <div>
          <ProfileNav
            activeSection={activeSection}
            onChange={setActiveSection}
          />

          {/* Contenido activo */}
          <div className="px-4 mt-6">
            {activeSection === "contact" && (
              <BusinessContactInfo
                address={data.address}
                email={data.email}
                phone={data.phone}
                whatsapp={data.whatsapp}
                facebookUrl={data.facebookUrl || ""}
                instagramUrl={data.instagramUrl || ""}
                websiteUrl={data.websiteUrl || ""}
              />
            )}
            {activeSection === "schedule" && (
              <LazySchedule businessId={businessId} />
            )}
            {activeSection === "categories" && (
              <LazyCategoriesTags businessId={businessId} />
            )}
            {activeSection === "gallery" && (
              <LazyGallery businessId={businessId} />
            )}
            {activeSection === "rating" && <Rating businessId={businessId} />}
          </div>
        </div>
      </section>
    </main>
  );
}