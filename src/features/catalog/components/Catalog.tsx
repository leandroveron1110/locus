"use client";

import React from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./CatalogMenu";
import CartList from "./cart/CartList";
import { useAuthStore } from "@/features/auth/store/authStore";

interface Props {
  businessId: string;
}

export default function Catalog({ businessId }: Props) {
  const { data, isLoading, error, isError } = useCatalg(businessId);
  const user = useAuthStore((state) => state.user);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna izquierda: Catálogo */}
        <div className="flex-1 space-y-16">
          {data.map((menu) => (
            <CatalogMenu key={menu.id} menu={menu} />
          ))}
        </div>

        {/* Columna derecha: Carrito */}
        <div className="w-full lg:w-80 xl:w-96">
          <div className="sticky top-24">
            <CartList userId={user?.id} businessId={businessId} />
          </div>
        </div>
      </div>
    </div>
  );
}
