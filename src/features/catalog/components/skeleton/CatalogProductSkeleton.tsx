// src/components/CatalogProductSkeleton.tsx

import React from "react";

export default function CatalogProductSkeleton() {
  return (
    <li
      role="status" // Para accesibilidad
      className="rounded-2xl border border-gray-200 p-3 h-auto animate-pulse"
    >
      <div className="flex flex-col">
        {/* Espacio para Estrellas */}
        <div className="flex justify-end gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-300 rounded-full"
            />
          ))}
        </div>

        <div className="flex gap-3 items-start ">
          {/* Imagen (Círculo) */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-300" />

          <div className="flex flex-col flex-grow justify-center w-full">
            {/* Título (Barra Larga) */}
            <div className="h-4 bg-gray-300 rounded-md w-3/4 mb-1.5" />

            {/* Descripción (Barra Corta) */}
            <div className="h-3 bg-gray-200 rounded-md w-full mb-1" />
            <div className="h-3 bg-gray-200 rounded-md w-11/12 mb-2" />

            {/* Precio (Barra Mediana) */}
            <div className="h-4 bg-gray-300 rounded-md w-1/3 mb-1.5" />

            {/* Badges (Pequeñas Píldoras) */}
            <div className="flex gap-2 mt-1">
              <div className="h-3 bg-gray-200 rounded-full w-1/5" />
              <div className="h-3 bg-gray-200 rounded-full w-1/6" />
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Cargando productos...</span>
    </li>
  );
}