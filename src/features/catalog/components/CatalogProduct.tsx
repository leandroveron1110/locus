// src/features/business/components/CatalogProduct.tsx
import React from 'react';
import Image from 'next/image'; // ⬅️ Importamos el componente Image
import { Star } from 'lucide-react';
import { Product } from '../types/catlog';
import { formatPrice } from '@/features/common/utils/formatPrice';

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

  // ⬅️ Lógica simplificada
  const isAvailable = available && stock > 0;
  const hasDiscount = !!originalPrice && !!discountAmount && Number(discountAmount) > 0;
  
  const discountPercent = hasDiscount
    ? Math.round(((Number(originalPrice) - Number(finalPrice)) / Number(originalPrice)) * 100)
    : 0;

  return (
    <li
      onClick={isAvailable ? onClick : undefined}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm p-4
        flex flex-col md:flex-row gap-4 transition duration-300
        ${isAvailable ? 'hover:shadow-md cursor-pointer' : 'opacity-60 cursor-not-allowed'}
      `}
      role="listitem"
      aria-label={`Producto: ${name}. ${isAvailable ? 'Clic para ver detalles.' : 'Agotado.'}`} // ⬅️ Mejoramos el aria-label
    >
      {/* Imagen */}
      {imageUrl && (
        <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative">
          <Image // ⬅️ Usamos el componente Image
            src={imageUrl}
            alt={name}
            fill // ⬅️ Usamos fill para que la imagen ocupe el contenedor
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, 128px"
            loading="lazy"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col flex-grow">
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

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {description}
        </p>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="text-yellow-400" size={14} />
            <span>
              {rating ? Number(rating).toFixed(1) : '–'}
            </span>
          </div>

          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-xs line-through text-gray-400 leading-none">
                {formatPrice(originalPrice, currencyMask)}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900 leading-none">
              {formatPrice(finalPrice, currencyMask)}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}