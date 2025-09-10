// features/search/components/SearchBusinessCard.tsx
"use client";

import { Star, MapPin, Users, Clock, Tag } from "lucide-react";
import { SearchResultBusiness } from "../types/search";
import { useRouter } from "next/navigation";

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
      className="flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer w-full h-full overflow-hidden border border-gray-100"
    >
      {/* Imagen */}
      <div className="w-full h-48 flex-shrink-0 relative">
        {business.logoUrl ? (
          <img
            src={business.logoUrl}
            alt={business.name}
            className="w-full h-full object-cover rounded-t-3xl rounded-b-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-3xl rounded-b-none">
            <Tag size={48} />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col justify-between flex-grow min-w-0">
        <div className="flex flex-col gap-4 flex-grow">
          {/* Encabezado: Nombre, Rating y Estado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xl font-extrabold text-gray-900 leading-tight line-clamp-2 min-w-0">
              {business.name}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Rating */}
              {typeof business.averageRating === "number" && (
                <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                  <Star size={18} fill="currentColor" strokeWidth={0} />
                  <span>{business.averageRating.toFixed(1)}</span>
                  {business.reviewCount ? (
                    <span className="text-gray-400 text-sm font-normal">
                      ({business.reviewCount})
                    </span>
                  ) : null}
                </div>
              )}
              {/* Estado de Apertura */}
              {business.isOpenNow !== undefined && (
                <div className="flex items-center gap-1.5 ml-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      business.isOpenNow
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {business.isOpenNow ? "Abierto" : "Cerrado"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          {business.description && (
            <p className="text-gray-600 text-sm leading-snug line-clamp-3">
              {business.description}
            </p>
          )}

          {/* Detalles (Dirección y Seguidores) */}
          <div className="flex flex-col gap-2 text-gray-500 text-sm">
            {business.address && (
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={16} className="flex-shrink-0 text-gray-400" />
                <span className="truncate">
                  {business.address}, {business.city}
                </span>
              </div>
            )}
            {typeof business.followersCount === "number" && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Users size={16} className="text-blue-500" />
                <span className="font-medium">
                  {business.followersCount.toLocaleString()}{" "}
                  {business.followersCount === 1 ? "seguidor" : "seguidores"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Categorías (al final para un diseño limpio) */}
        {business.categoryNames && business.categoryNames.length > 0 && (
          <div className="mt-4 flex overflow-x-auto gap-2 py-1 scrollbar-hide flex-shrink-0">
            {business.categoryNames.map((tag) => (
              <span
                key={tag}
                className="flex-shrink-0 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full select-none"
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