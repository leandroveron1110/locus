// src/features/business/components/BusinessProfile.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { withSkeleton } from "@/features/common/utils/withSkeleton";

// 📦 Importaciones de Skeletons y componentes
import BusinessHeader from "./components/BusinessHeader";
import ProfileNav from "./components/ProfileNav";
import { BusinessProfileSkeleton } from "./components/Skeleton/BusinessProfileSkeleton";
import { SkeletonCategories } from "./components/Skeleton/SkeletonCategories";
import { SkeletonSchedule } from "./components/Skeleton/SkeletonSchedule";
import { SkeletonGallery } from "./components/Skeleton/SkeletonGallery";
import { SkeletonContactInfo } from "./components/Skeleton/SkeletonContactInfo";
import { SkeletonRating } from "./components/Skeleton/SkeletonRating";
import { SkeletonCatalog } from "./components/Skeleton/SkeletonCatalog";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  businessId: string;
}

// 📦 Todos los componentes se cargarán de forma diferida con withSkeleton
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

const LazyBusinessContactInfo = withSkeleton(
  () => import("./components/BusinessContactInfo"),
  SkeletonContactInfo
);

const LazyRating = withSkeleton(
  () => import("./components/Rating"),
  SkeletonRating
);

const LazyCatalog = withSkeleton(
  () => import("@/features/catalog/components/Catalog"),
  SkeletonCatalog
);

export default function BusinessProfile({ businessId }: Props) {
  const router = useRouter();
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);
  const [activeSection, setActiveSection] = useState<string>("gallery");

  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error]);

  if (isLoading) {
    return <BusinessProfileSkeleton />;
  }

  if (!data) return null;

  const hasMenu = data.modulesConfig.menu?.enabled ?? false;

  return (
    <main className="h-full">
      <div className="mb-8">
        <BusinessHeader
          fullDescription={data.fullDescription || ""}
          logoUrl={data.logoUrl}
          name={data.name}
          businessId={data.id}
          ratingsCount={data.ratingsCount}
        />
      </div>

      <section className=" space-y-10">
        <div>
          <ProfileNav
            activeSection={activeSection}
            onChange={setActiveSection}
            hasMenu={hasMenu}
          />
          <div className="px-4 mt-6">
            {/* Lógica de renderizado simple, sin Suspense */}
            {activeSection === "contact" && (
              <LazyBusinessContactInfo
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
            {activeSection === "rating" && (
              <LazyRating businessId={businessId} />
            )}
            {activeSection === "menu" &&
              (hasMenu ? (
                <LazyCatalog businessId={businessId} business={data} />
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg font-medium">
                    El menú aún no está disponible para este negocio.
                  </p>
                  <p className="text-sm mt-2">
                    Te invitamos a explorar otras secciones o volver más tarde.
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
