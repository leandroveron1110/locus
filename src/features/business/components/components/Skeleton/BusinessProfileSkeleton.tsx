// src/features/business/components/BusinessProfileSkeleton.tsx
import React from 'react';

export const BusinessProfileSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Esqueleto del Encabezado/Banner */}
      <div className="w-full h-64 bg-gray-200 rounded-b-3xl sm:hidden"></div>
      <div className="hidden sm:flex sm:items-start w-full gap-4">
        <div className="w-40 h-40 bg-gray-200 rounded-3xl flex-shrink-0"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      
      {/* Esqueleto de las secciones de contenido principal */}
      <div className="mt-8 px-4 max-w-6xl mx-auto space-y-10">
        {/* Esqueleto de las Pestañas (Tabs) */}
        <div className="flex justify-around items-center border-b border-gray-200">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Esqueleto del contenido de la sección (ej. Galería o Información) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};