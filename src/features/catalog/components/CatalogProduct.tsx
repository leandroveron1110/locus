import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types/catlog';

interface Props {
  product: Product;
  onClick: () => void;
}

const SoldOutLabel = 'Agotado';

export default function CatalogProduct({ product, onClick }: Props) {
  const {
    name,
    imageUrl,
    description,
    rating,
    currencyMask,
    finalPrice,
    originalPrice,
    discountAmount,
    available,
    stock
  } = product;

  const isAvailable = useMemo(() => available && stock > 0, [available, stock]);

  const hasDiscount = useMemo(() => {
    return originalPrice && discountAmount && Number(discountAmount) > 0;
  }, [originalPrice, discountAmount]);

  const discountPercent = useMemo(() => {
    if (!hasDiscount) return 0;
    const original = Number(originalPrice);
    const final = Number(finalPrice);
    if (original <= 0) return 0; // Evita división por cero
    return Math.round(((original - final) / original) * 100);
  }, [hasDiscount, originalPrice, finalPrice]);

  return (
    <li
      onClick={isAvailable ? onClick : undefined}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm p-4
        flex flex-col md:flex-row gap-4 transition duration-300
        ${isAvailable ? 'hover:shadow-md cursor-pointer' : 'opacity-60 cursor-not-allowed'}
      `}
      role="listitem"
      aria-label={`Producto: ${name}`}
    >
      {/* Imagen */}
      {imageUrl && (
        <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col flex-grow">
        {/* Header con Título y Badges */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {name}
          </h4>
          <div className="flex flex-shrink-0 gap-1 ml-2">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                {discountPercent}% OFF
              </span>
            )}
            {!isAvailable && (
              <span className="bg-gray-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                {SoldOutLabel}
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {description}
        </p>

        {/* Precios y Rating */}
        <div className="flex items-end justify-between mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="text-yellow-400" size={14} />
            <span>
              {rating ? Number(rating).toFixed(1) : '–'}
            </span>
          </div>

          {/* Precios */}
          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-xs line-through text-gray-400 leading-none">
                {currencyMask} {(Number(originalPrice) || 0).toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900 leading-none">
              {currencyMask} {(Number(finalPrice) || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}