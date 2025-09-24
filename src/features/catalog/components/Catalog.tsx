// src/features/catalog/components/Catalog.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ShoppingCart, Search } from "lucide-react";
import CartModal from "./cart/CartModal";
import { useCartStore } from "../stores/useCartStore";
import { CatalogSkeleton } from "./skeleton/CatalogSkeleton";
import { Business } from "@/features/business/types/business";
import Title from "@/features/common/ui/Title";
import { Menu, Section, Product } from "../types/catlog";

interface Props {
  businessId: string;
  business: Business;
}

// 🆕 Nueva interfaz para el producto aplanado con referencias de menú y sección
interface FlattenedProduct extends Product {
  menuId: string;
  menuName: string;
  sectionId: string;
  sectionName: string;
}

export default function Catalog({ businessId, business }: Props) {
  const { data, isLoading, isError, error } = useCatalg(businessId);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const user = useAuthStore((state) => state.user);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 1️⃣ Aplanar todos los productos de todos los menús
  const allProducts = useMemo(() => {
    const products: FlattenedProduct[] = [];
    data?.forEach((menu) => {
      menu.sections.forEach((section) => {
        section.products.forEach((product) => {
          products.push({
            ...product,
            menuId: menu.id,
            menuName: menu.name,
            sectionId: section.id,
            sectionName: section.name,
          });
        });
      });
    });
    return products;
  }, [data]);

  // 2️⃣ Filtrar los productos según el término de búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return allProducts;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        (product.description &&
          product.description.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [allProducts, searchTerm]);

  // 3️⃣ Agrupar los resultados filtrados de nuevo en una estructura de menús y secciones
  const groupedResults = useMemo(() => {
    // Si no hay término de búsqueda, devolvemos los datos originales
    if (!searchTerm) {
      return data || [];
    }

    const menusMap = new Map<string, Menu>();
    
    filteredProducts.forEach((product) => {
      // Si el menú aún no existe en el mapa, lo creamos
      if (!menusMap.has(product.menuId)) {
        const originalMenu = data?.find((m) => m.id === product.menuId);
        if (originalMenu) {
          menusMap.set(product.menuId, { ...originalMenu, sections: [] });
        }
      }

      const currentMenu = menusMap.get(product.menuId);
      if (currentMenu) {
        // Si la sección no existe en el menú actual, la creamos
        let currentSection = currentMenu.sections.find((s) => s.id === product.sectionId);
        if (!currentSection) {
          const originalSection = data?.find(m => m.id === product.menuId)?.sections.find(s => s.id === product.sectionId);
          if (originalSection) {
            currentSection = { ...originalSection, products: [] };
            currentMenu.sections.push(currentSection);
          }
        }
        currentSection?.products.push(product);
      }
    });

    // Ordenamos las secciones dentro de cada menú
    Array.from(menusMap.values()).forEach(menu => {
      menu.sections.sort((a, b) => a.index - b.index);
    });

    return Array.from(menusMap.values());
  }, [filteredProducts, searchTerm, data]);

  if (isLoading) return <CatalogSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <p className="text-red-600 text-base font-medium">
          Error al cargar la información
        </p>
        <p className="text-sm text-gray-500 mt-1"></p>
      </div>
    );
  }

  if (!data || data.length === 0 || !business) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-sm">No hay catálogos o información disponible.</p>
      </div>
    );
  }

  return (
    <div className="pb-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Barra de búsqueda */}
        <div className="relative my-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar en el menú..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Contenido principal: Menús filtrados o mensaje de no resultados */}
        <div className="flex flex-col gap-6 mt-6">
          {groupedResults.length > 0 ? (
            groupedResults.map((menu) => (
              <CatalogMenu key={menu.id} menu={menu} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">No se encontraron productos.</p>
            </div>
          )}
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
          businessAddress={business.address}
          businessName={business.name}
          businessPhone={business.phone}
          businessAddresslatitude={Number(business.latitude) || 0}
          businessAddresslongitude={Number(business.longitude) || 0}
          businessPaymentMethod={business.businessPaymentMethod || []}
        />
      </div>
    </div>
  );
}