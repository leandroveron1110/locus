// src/features/catalog/components/Catalog.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ShoppingCart, Search } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { CatalogSkeleton } from "./skeleton/CatalogSkeleton";
import { Business } from "@/features/business/types/business";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import { Virtuoso } from "react-virtuoso";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

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

  const filteredData = useMemo(() => {
    if (!searchTerm) return normalizedData;
    const lowerSearch = searchTerm.toLowerCase();

    return normalizedData
      .map((menu) => {
        const filteredSections = menu.sections
          .map((section) => ({
            ...section,
            products: section.products.filter((product) =>
              product.lowerName.includes(lowerSearch)
            ),
          }))
          .filter((section) => section.products.length > 0);
        return { ...menu, sections: filteredSections };
      })
      .filter((menu) => menu.sections.length > 0);
  }, [normalizedData, searchTerm]);

  const handleSearchChange = useMemo(
    () =>
      debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
      }, 300),
    []
  );

  if (isLoading) return <CatalogSkeleton />;

  if (!data || data.length === 0 || !business) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-sm">No hay catálogos o información disponible.</p>
      </div>
    );
  }

  const isSearching = searchTerm.trim() !== "";
  const displayData = isSearching ? filteredData : normalizedData;

  return (
    <div className="w-full h-screen pb-2">
      <div className="max-w-7xl h-full flex flex-col">
        {/* Contenedor del buscador */}
        <div className="relative my-8 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar en el menú..."
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Contenedor de la lista */}
        <div className="flex-1 overflow-y-auto">
          {displayData.length > 0 ? (
            <Virtuoso
              data={displayData}
              itemContent={(index, menu) => (
                <MemoizedCatalogMenu key={index} menu={menu} />
              )}
              style={{ height: "100%", width: "100%" }}
            />
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">No se encontraron productos.</p>
            </div>
          )}
        </div>
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
