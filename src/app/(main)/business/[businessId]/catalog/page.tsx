// src/features/business/components/BusinessCatalog.tsx
"use client";

import Catalog from "@/features/catalog/components/Catalog";
import AppHeader from "@/features/header/components/AppHeader";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function BusinessCatalog() {
  const params = useParams();
  
  // Extraemos el businessId del objeto de parámetros.
  // Es seguro asumir que será un string simple en esta ruta.
  const businessId = useMemo(() => {
    const rawId = params.businessId;
    return Array.isArray(rawId) ? rawId[0] : rawId;
  }, [params.businessId]);

  // Manejo de estado: si el businessId no existe, no renderizamos nada
  if (!businessId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-red-600 font-semibold">
          Error: ID de negocio no encontrado.
        </p>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-100 w-full ">
        <main className="w-full">
          <div className="bg-white w-full sm:p-8">
            <Catalog businessId={businessId} />
          </div>
        </main>
      </div>
    </>
  );
}