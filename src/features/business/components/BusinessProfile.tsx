"use client";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Star,
  Tag,
  Clock,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SkeletonFollowButton } from "./components/Skeleton/SkeletonFollowButton";
import { SkeletonCategories } from "./components/Skeleton/SkeletonCategories";
import { SkeletonSchedule } from "./components/Skeleton/SkeletonSchedule";
import { SkeletonGallery } from "./components/Skeleton/SkeletonGallery";

interface Props {
  businessId: string;
}

const LazyCategoriesTags = dynamic(
  () => import("./components/CategoriesTags"),
  {
    ssr: false,
  }
);

const LazyFolloweButton = dynamic(() => import("./components/FollowButton"), {
  ssr: false,
});

const LazySchedule = dynamic(() => import("./components/Schedule"), {
  ssr: false,
});

const LazyGallery = dynamic(() => import("./components/Gallery"), {
  ssr: false,
});

export default function BusinessProfile({ businessId }: Props) {
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);
  if (isLoading)
    return <p className="text-center text-gray-500 mt-8">Cargando perfil...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-8">
        Error: {(error as Error).message}
      </p>
    );
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Card principal */}
      <section className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
        {/* Logo y nombre */}
        <div className="flex items-center gap-8">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt={`${data.name} logo`}
              className="w-32 h-32 rounded-2xl object-cover border border-gray-200 shadow-sm"
            />
          )}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {data.name}
            </h1>
            {data.shortDescription && (
              <p className="text-gray-600 mt-2 text-lg">
                {data.shortDescription}
              </p>
            )}
          </div>
        </div>

        {/* Descripción */}
        {data.fullDescription && (
          <p className="text-gray-700 leading-relaxed">
            {data.fullDescription}
          </p>
        )}

        <Suspense fallback={<SkeletonFollowButton />}>
          <LazyFolloweButton businessId={businessId} />
        </Suspense>

        {typeof data.averageRating === "number" && (
          <section className="mt-8 flex items-center gap-3 text-yellow-500 font-semibold text-lg">
            <Star size={24} />
            <span>{data.averageRating.toFixed(1)} / 5</span>
            <span className="text-gray-500 text-base">
              ({data.ratingsCount ?? 0} reseñas)
            </span>
          </section>
        )}

        <Suspense fallback={<SkeletonCategories />}>
          <LazyCategoriesTags businessId={businessId} />
        </Suspense>

        {/* Contacto */}
        <div className="grid sm:grid-cols-2 gap-6 text-gray-700 text-base">
          <div className="flex items-center gap-3">
            <MapPin className="text-blue-600" size={20} />
            <span>{data.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-green-600" size={20} />
            <span>{data.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-green-500" size={20} />
            <span>{data.whatsapp}</span>
          </div>
          {data.email && (
            <div className="flex items-center gap-3">
              <Mail className="text-red-600" size={20} />
              <span>{data.email}</span>
            </div>
          )}
        </div>

        {/* Redes sociales */}
        <div className="flex items-center gap-6 mt-4 text-gray-600">
          {data.websiteUrl && (
            <a
              href={data.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sitio web"
              className="hover:text-blue-700 transition"
            >
              <Globe size={24} />
            </a>
          )}
          {data.facebookUrl && (
            <a
              href={data.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-800 transition"
            >
              <Facebook size={24} />
            </a>
          )}
          {data.instagramUrl && (
            <a
              href={data.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-600 transition"
            >
              <Instagram size={24} />
            </a>
          )}
        </div>

        {/* Horarios */}
        <Suspense fallback={<SkeletonSchedule />}>
          <LazySchedule businessId={businessId} />
        </Suspense>

        <Suspense fallback={<SkeletonGallery />}>
          <LazyGallery businessId={businessId} />
        </Suspense>

        {/* Calificación
        {typeof data.averageRating === "number" && (
          <section className="mt-8 flex items-center gap-3 text-yellow-500 font-semibold text-lg">
            <Star size={24} />
            <span>{data.averageRating.toFixed(1)} / 5</span>
            <span className="text-gray-500 text-base">
              ({data.ratingsCount ?? 0} reseñas)
            </span>
          </section>
        )}

        {/* Ubicación */}
        {/* {typeof data.latitude === "number" &&
          typeof data.longitude === "number" && (
            <section className="mt-8 text-gray-600 text-sm">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <MapPin size={20} />
                Ver ubicación en Google Maps
              </a>
            </section>
          )}  */}
      </section>
    </div>
  );
}
