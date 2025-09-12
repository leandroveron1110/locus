"use client";

import React, { useState } from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useBusinessProfile } from "../hooks/useBusiness";
import BusinessHeader from "@/features/business/components/components/BusinessHeader";
import { ShoppingCart } from "lucide-react";
import CartModal from "./cart/CartModal";
import { useCartStore } from "../stores/useCartStore";
import { CatalogSkeleton } from "./skeleton/CatalogSkeleton";

interface Props {
  businessId: string;
}

export default function Catalog({ businessId }: Props) {
  const { data, isLoading, isError, error } = useCatalg(businessId);
  const {
    data: dataBusiness,
    isLoading: isLoadingBusiness,
    isError: isErrorBusiness,
    error: errorBusiness,
  } = useBusinessProfile(businessId);

  const user = useAuthStore((state) => state.user);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🛒 Productos del carrito
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (isLoading || isLoadingBusiness) return <CatalogSkeleton />;

  if (isError || isErrorBusiness) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <p className="text-red-600 text-base font-medium">
          Error al cargar la información
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {(error || (errorBusiness as Error))?.message}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0 || !dataBusiness) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-sm">No hay catálogos o información disponible.</p>
      </div>
    );
  }

  return (
    <div className="pb-25">
      {/* Header del negocio */}
      <div className="pt-4">
        <BusinessHeader
          fullDescription={
            dataBusiness.fullDescription ?? dataBusiness.shortDescription
          }
          logoUrl={dataBusiness.logoUrl}
          name={dataBusiness.name}
          businessId={dataBusiness.id}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Contenido principal */}
        <div className="flex flex-col gap-6 mt-6">
          {data.map((menu) => (
            <CatalogMenu key={menu.id} menu={menu} />
          ))}
        </div>

        {/* Botón flotante carrito */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Modal del carrito */}
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          userId={user?.id}
          businessId={businessId}
          businessAddress={dataBusiness.address}
          businessName={dataBusiness.name}
          businessPhone={dataBusiness.phone}
          businessAddresslatitude={Number(dataBusiness.latitude) || 0}
          businessAddresslongitude={Number(dataBusiness.longitude) || 0}
          businessPaymentMethod={dataBusiness.businessPaymentMethod || []}
        />
      </div>
    </div>
  );
}
