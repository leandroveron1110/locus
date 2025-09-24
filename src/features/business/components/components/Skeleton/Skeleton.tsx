// src/features/common/components/Skeleton.tsx

import React from 'react';

/**
 * Componente de esqueleto genérico con animación de carga.
 * Se puede usar como fallback para componentes cargados con React.lazy.
 */
export function Skeleton() {
  return (
    <div className="w-full h-auto p-4 rounded-xl shadow bg-white animate-pulse">
      {/* Línea de título */}
      <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
      
      {/* Contenedor con espacio para las líneas de texto */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-300 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}