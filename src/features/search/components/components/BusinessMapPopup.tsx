// src/features/search/components/BusinessMapPopup.tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { SearchResultBusiness } from "@/features/search/types/search";

interface BusinessMapPopupProps {
  business: SearchResultBusiness;
}

export function BusinessMapPopup({ business }: BusinessMapPopupProps) {
  return (
    <div className="flex flex-col gap-2 max-w-[220px]">
      {/* Logo + nombre */}
      <div className="flex items-center gap-2">
        {business.logoUrl ? (
          <Image
            src={business.logoUrl}
            alt={business.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            {business.name.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <h4 className="font-bold text-gray-900 text-sm">{business.name}</h4>
          {business.isOpenNow !== undefined && (
            <span
              className={`text-xs font-medium ${
                business.isOpenNow ? "text-green-600" : "text-red-500"
              }`}
            >
              {business.isOpenNow ? "Abierto" : "Cerrado"}
            </span>
          )}
        </div>
      </div>

      {/* Descripción */}
      {business.description && (
        <p className="text-xs text-gray-600 line-clamp-2">{business.description}</p>
      )}

      {/* Categorías */}
      {business.categoryNames && business.categoryNames.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {business.categoryNames.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Rating */}
      {business.averageRating !== undefined && (
        <div className="flex items-center gap-1 text-xs text-gray-700">
          <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
          <span>{business.averageRating.toFixed(1)}</span>
          {business.reviewCount && <span>({business.reviewCount})</span>}
        </div>
      )}

      {/* Ver más */}
      <a
        href={`/business/${business.id}`}
        className="text-blue-600 text-xs font-medium hover:underline"
      >
        Ver más detalles →
      </a>
    </div>
  );
}
