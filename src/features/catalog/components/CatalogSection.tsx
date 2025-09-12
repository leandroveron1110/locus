// src/components/CatalogSection.tsx
"use client";

import React, { useCallback, useState, useMemo } from "react";
import { Product, Section } from "../types/catlog";
import CatalogProduct from "./CatalogProduct";
import ProductModal from "./ProductModal";

interface Props {
  section: Section;
}

export default function CatalogSection({ section }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // ⬅️ Usamos useMemo para ordenar los productos solo cuando cambian
  const sortedProducts = useMemo(() => {
    return [...section.products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [section.products]);

  return (
    <div className="mb-12 relative">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        {section.name}
      </h3>

      {/* ⬅️ El `li` ahora recibe el producto ya ordenado */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {sortedProducts.map((product) => (
          <CatalogProduct
            key={product.id}
            product={product}
            onClick={() => handleSelectProduct(product)}
          />
        ))}
      </ul>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}