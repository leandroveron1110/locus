// src/components/CatalogProductsSkeletonList.tsx

import React from 'react';
import CatalogProductSkeleton from './CatalogProductSkeleton'; // Importamos el esqueleto

interface Props {
    count?: number; // Cuántos esqueletos renderizar
}

/**
 * Renderiza una lista de esqueletos para productos.
 */
export default function CatalogProductsSkeletonList({ count = 10 }: Props) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CatalogProductSkeleton key={index} />
      ))}
    </ul>
  );
}