"use client";

import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
} from "lucide-react";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import dynamic from "next/dynamic";
import { withSkeleton } from "@/features/common/utils/withSkeleton";

import { SkeletonFollowButton } from "./components/Skeleton/SkeletonFollowButton";
import { SkeletonCategories } from "./components/Skeleton/SkeletonCategories";
import { SkeletonSchedule } from "./components/Skeleton/SkeletonSchedule";
import { SkeletonGallery } from "./components/Skeleton/SkeletonGallery";
import Rating from "./components/Rating";

interface Props {
  businessId: string;
}

const LazyCategoriesTags = withSkeleton(
  () => import("./components/CategoriesTags"),
  SkeletonCategories
);
const LazyFollowButton = withSkeleton(
  () => import("./components/FollowButton"),
  SkeletonFollowButton
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
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);

  if (isLoading) return <p className="text-center text-gray-500 mt-8">Cargando perfil...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-8">
        Error: {(error as Error).message}
      </p>
    );
  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt={`${data.name} logo`}
              className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl border border-gray-200 shadow"
            />
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{data.name}</h1>
            {data.shortDescription && (
              <p className="mt-2 text-gray-600 text-base">{data.shortDescription}</p>
            )}
          </div>
        </div>

        {/* Descripción */}
        {data.fullDescription && (
          <p className="text-gray-700 text-base leading-relaxed">{data.fullDescription}</p>
        )}

        {/* Botón seguir */}
        <LazyFollowButton businessId={businessId} />

        {/* Categorías & Tags */}
        <LazyCategoriesTags businessId={businessId} />

        {/* Contacto */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Contacto</h2>
          <ul className="grid sm:grid-cols-2 gap-4 text-gray-700 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="text-blue-600" size={18} />
              {data.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-green-600" size={18} />
              {data.phone}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-green-500" size={18} />
              {data.whatsapp}
            </li>
            {data.email && (
              <li className="flex items-center gap-3">
                <Mail className="text-red-600" size={18} />
                {data.email}
              </li>
            )}
          </ul>
        </section>

        {/* Redes Sociales */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Redes Sociales</h2>
          <div className="flex items-center gap-5 text-gray-600 text-lg">
            {data.websiteUrl && (
              <a href={data.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                <Globe />
              </a>
            )}
            {data.facebookUrl && (
              <a href={data.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-800">
                <Facebook />
              </a>
            )}
            {data.instagramUrl && (
              <a href={data.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600">
                <Instagram />
              </a>
            )}
          </div>
        </section>

        {/* Horarios */}
        <LazySchedule businessId={businessId} />

        {/* Galería */}
        <LazyGallery businessId={businessId} />

        {/* Reseñas */}
        <Rating businessId={businessId} />
      </section>
    </div>
  );
}
