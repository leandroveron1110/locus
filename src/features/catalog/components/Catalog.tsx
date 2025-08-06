"use client";

import React from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./CatalogMenu";

interface Props {
  businessId: string;
}

export default function Catalog({ businessId }: Props) {
  const { data, isLoading, error, isError } = useCatalg(businessId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Cargando catálogo...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-600 text-lg">
          Error al cargar catálogo: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p>No hay catálogos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {data.map((menu) => (
        <CatalogMenu key={menu.id} menu={menu} />
      ))}
    </div>
  );
}
