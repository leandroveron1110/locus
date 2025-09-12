// src/features/catalog/components/CatalogSkeleton.tsx
import React from "react";

export const CatalogSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Esqueleto del Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-full h-64 bg-gray-200 rounded-b-3xl sm:hidden"></div>
        <div className="hidden sm:block w-40 h-40 bg-gray-200 rounded-3xl"></div>
        <div className="flex-1 space-y-4 pt-4 sm:pt-0">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 w-32 bg-gray-300 rounded-full mt-4"></div>
        </div>
      </div>
      
      {/* Esqueleto de las Secciones del Catálogo */}
      <div className="px-4 max-w-6xl mx-auto space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-7 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-300 rounded-full mt-4"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};