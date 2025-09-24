// src/features/business/components/BusinessProfile.tsx
"use client";

import React, { useState, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { withSkeleton } from "@/features/common/utils/withSkeleton";

import { SkeletonCategories } from "./components/Skeleton/SkeletonCategories";
import { SkeletonSchedule } from "./components/Skeleton/SkeletonSchedule";
import { SkeletonGallery } from "./components/Skeleton/SkeletonGallery";

import BusinessHeader from "./components/BusinessHeader";
import ProfileNav from "./components/ProfileNav";
import { BusinessProfileSkeleton } from "./components/Skeleton/BusinessProfileSkeleton";
import { Skeleton } from "./components/Skeleton/Skeleton";

interface Props {
  businessId: string;
}

// 📦 Componentes que se cargarán de forma diferida
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

// 🆕 Cargamos estos componentes pesados de forma diferida
const LazyBusinessContactInfo = lazy(() => import("./components/BusinessContactInfo"));
const LazyRating = lazy(() => import("./components/Rating"));
const LazyCatalog = lazy(() => import("@/features/catalog/components/Catalog"));

export default function BusinessProfile({ businessId }: Props) {
  const router = useRouter();
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);

  const [activeSection, setActiveSection] = useState<string>("gallery");

  if (isLoading) {
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

  return (
    <main className="pb-25">
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
          />

          <div className="px-4 mt-6">
            <Suspense fallback={<Skeleton />}>
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
              {hasMenu && activeSection === "menu" && (
                <LazyCatalog businessId={businessId} business={data} />
              )}
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}