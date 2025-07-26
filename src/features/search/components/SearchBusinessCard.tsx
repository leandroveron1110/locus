"use client";

import { Star, MapPin, Tags } from "lucide-react";
import { SearchResultBusiness } from "../types/search";
import { useRouter } from "next/navigation";


interface BusinessCardProps {
  business: SearchResultBusiness;
}

export const SearchBusinessCard = ({
  business,
}: BusinessCardProps) => {

    const router = useRouter();

  const handleClick = () => {
    router.push(`/business/${business.id}`); // Navega a la página del negocio
  };


  return (
    <div
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={handleClick}
    >
      {business.logoUrl ? (
        <img
          src={business.logoUrl}
          alt={business.name}
          className="w-full sm:w-40 h-40 object-cover rounded-xl bg-gray-100"
        />
      ) : (
        <div className="w-full sm:w-40 h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
          Sin Logo
        </div>
      )}

      <div className="flex flex-col justify-between w-full">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {business.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {business.description}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
          {business.address && (
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{`${business.address}, ${business.city}, ${business.province}`}</span>
            </div>
          )}

          {typeof business.averageRating === "number" && (
            <div className="flex items-center gap-1">
              <Star className="text-yellow-500" size={16} />
              <span>{business.averageRating.toFixed(1)} / 5</span>
              {business.reviewCount ? (
                <span>({business.reviewCount})</span>
              ) : null}
            </div>
          )}

          {business.isOpenNow !== undefined && (
            <span
              className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                business.isOpenNow
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {business.isOpenNow ? "Abierto ahora" : "Cerrado"}
            </span>
          )}
        </div>

        {business.tagNames?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {business.tagNames.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
