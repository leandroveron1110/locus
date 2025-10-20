// src/features/search/components/SearchBusinessCard.tsx
"use client";

import { Star, Tag } from "lucide-react";
import { SearchResultBusiness } from "../types/search";
import { useRouter } from "next/navigation";
import logo from "../../../../public/locu-g.png";

interface BusinessCardProps {
  business: SearchResultBusiness;
}

export const SearchBusinessCard = ({ business }: BusinessCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/business/${business.id}`, { scroll: false });
  };

  const logoUrlBusiness = business.logoUrl || logo.src;

  return (
    <li
      onClick={handleClick}
      role="listitem"
      className={`
    rounded-2xl border border-gray-200 p-3 h-auto transition
    cursor-pointer hover:shadow-md
  `}
    >
      <div className="flex flex-col">
        {/* Contenido principal */}
        <div className="flex gap-3 items-start">
          {/* Imagen */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center bg-gray-50">
            <img
              src={logoUrlBusiness}
              alt={business.name}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>

          {/* Texto */}
          <div className="flex flex-col flex-grow gap-1 justify-center">
            <h4 className="text-sm font-semibold text-gray-900 uppercase line-clamp-1">
              {business.name}
            </h4>

            {business.description && (
              <p className="text-gray-600 text-[10px] line-clamp-2">
                {business.description}
              </p>
            )}

            <div className="flex items-center gap-1 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.round(business.averageRating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {business.isOpenNow !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                    business.isOpenNow
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {business.isOpenNow ? "Abierto" : "Cerrado"}
                </span>
              )}
            </div>

            {business.categoryNames && business.categoryNames.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {business.categoryNames.slice(0, 3).map((tag, index) => (
                  <span
                    key={tag + index}
                    className="border border-gray-300 text-gray-700 text-[8px] px-1.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {business.categoryNames.length > 3 && (
                  <span className="border border-gray-300 text-gray-500 text-[8px] px-1.5 py-0.5 rounded-full bg-gray-50">
                    +{business.categoryNames.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
