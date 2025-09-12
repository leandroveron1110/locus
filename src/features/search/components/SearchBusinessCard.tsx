// src/features/search/components/SearchBusinessCard.tsx
"use client";

import { Star, MapPin, Tag } from "lucide-react";
import { SearchResultBusiness } from "../types/search";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BusinessCardProps {
  business: SearchResultBusiness;
}

export const SearchBusinessCard = ({ business }: BusinessCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/business/${business.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer w-full h-full overflow-hidden border border-gray-200"
    >
      {/* Imagen del Negocio */}
      <div className="w-full h-36 sm:h-40 flex-shrink-0 relative">
        {business.logoUrl ? (
          <Image
            src={business.logoUrl}
            alt={business.name}
            fill
            className="object-cover rounded-t-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-2xl">
            <Tag size={48} />
          </div>
        )}
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-4 flex flex-col justify-between flex-grow min-w-0">
        <div className="flex flex-col gap-2 flex-grow">
          {/* Nombre y Estado */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight line-clamp-2 min-w-0">
              {business.name}
            </h3>
            {business.isOpenNow !== undefined && (
              <span
                className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                  business.isOpenNow
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {business.isOpenNow ? "Abierto" : "Cerrado"}
              </span>
            )}
          </div>
          
          {/* Rating */}
          {typeof business.averageRating === "number" && (
            <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-base">
              <Star size={16} fill="currentColor" strokeWidth={0} />
              <span>{business.averageRating.toFixed(1)}</span>
              {business.reviewCount && (
                <span className="text-gray-400 text-xs font-normal ml-1">
                  ({business.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Descripción */}
          {business.description && (
            <p className="text-sm text-gray-600 leading-snug line-clamp-2 mt-2">
              {business.description}
            </p>
          )}

          {/* Dirección */}
          {business.address && (
            <div className="flex items-center gap-1.5 min-w-0 mt-2 text-sm text-gray-500">
              <MapPin size={16} className="flex-shrink-0 text-gray-400" />
              <span className="truncate">
                {business.address}, {business.city}
              </span>
            </div>
          )}
        </div>

        {/* Categorías */}
        {business.categoryNames && business.categoryNames.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 flex-shrink-0">
            {business.categoryNames.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full select-none"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};