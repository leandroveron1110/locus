// src/components/CatalogSection.tsx
"use client";

import React, { useCallback, useState, useMemo } from "react";
import { Product, Section } from "../types/catlog";
import CatalogProduct from "./CatalogProduct";
import ProductModal from "./ProductModal";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  section: Section;
}

export default function CatalogSection({ section }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // ⬅️ Usamos useMemo para ordenar los productos solo cuando cambian
  const sortedProducts = useMemo(() => {
    return [...section.products].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );
  }, [section.products]);

  return (
    <div className="mb-12 relative">
      {/* Nuevo header con el botón de colapsar */}
      <div className="flex justify-between items-center mb-4">
        {/* Nombre de la sección y cantidad de productos */}
        <div className="flex items-baseline gap-2">
          <h3 className="font-bold text-gray-900 leading-tight text-gray-800">
            {section.name}
          </h3>
          <span className="text-gray-500 text-sm">
            ({sortedProducts.length})
          </span>
        </div>

        {/* Botón de colapsar/expandir */}
        {sortedProducts.length > 0 && (
          <button
            onClick={handleToggleCollapse}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={
              isCollapsed ? "Expandir productos" : "Colapsar productos"
            }
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Renderizado condicional de la lista de productos */}
      {!isCollapsed && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {sortedProducts.map((product) => (
            <CatalogProduct
              key={product.id}
              product={product}
              onClick={() => handleSelectProduct(product)}
            />
          ))}
        </ul>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}
