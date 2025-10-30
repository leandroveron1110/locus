"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { CatalogSkeleton } from "./skeleton/CatalogSkeleton";
import { Business } from "@/features/business/types/business";
import dynamic from "next/dynamic";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  businessId: string;
  business: Business;
}

const CartModal = dynamic(() => import("./cart/CartModal"), {
  ssr: false,
  loading: () => <div className="text-center py-6">Cargando carrito...</div>,
});

const MemoizedCatalogMenu = React.memo(CatalogMenu);

export default function Catalog({ businessId, business }: Props) {
  const { data, isLoading, isError, error } = useCatalg(businessId);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.items);
  const clearCartItems = useCartStore((state) => state.clearCart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { addAlert } = useAlert();

  // ✅ Limpiar carrito en la primera carga
  useEffect(() => {
    clearCartItems();
    // opcional: notificar al usuario
    // addAlert({ message: "El carrito se ha vaciado al ingresar al catálogo", type: "info" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]); // limpiar si cambia de negocio

  // Manejo de errores al cargar catálogo
  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

  // Normalizar datos
  const normalizedData = useMemo(() => {
    if (!data) return [];
    return data.map((menu) => ({
      ...menu,
      sections: menu.sections.map((section) => ({
        ...section,
        products: section.products.map((product) => ({
          ...product,
          lowerName: product.name.toLowerCase(),
        })),
      })),
    }));
  }, [data]);

  if (isLoading) return <CatalogSkeleton />;

  if (!data || data.length === 0 || !business) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-sm">No hay catálogos o información disponible.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-2 bg-white">
      <div className="max-w-7xl h-full flex flex-col">
        {normalizedData.length > 0 ? (
          normalizedData.map((menu, index) => (
            <MemoizedCatalogMenu key={index} menu={menu} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">No se encontraron productos.</p>
          </div>
        )}
      </div>

      {/* Botón flotante del carrito */}
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

      {isCartOpen && (
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          userId={user?.id}
          businessId={businessId}
          businessAddress={business.address}
          businessName={business.name}
          businessPhone={business.phone}
          businessAddresslatitude={Number(business.latitude) || 0}
          businessAddresslongitude={Number(business.longitude) || 0}
          businessPaymentMethod={business.businessPaymentMethod || []}
        />
      )}
    </div>
  );
}
