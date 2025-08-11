"use client";

import React, { useCallback, useState } from "react";
import { Product, Section } from "../types/catlog";
import CatalogProduct from "./CatalogProduct";
import ProductDetails from "./ProductDetails";

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

  return (
    <div className="mb-12 relative">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        {section.name}
      </h3>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {section.products
          .sort((a, b) => b.rating - a.rating)
          .map((product) => (
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

interface ModalProps {
  product: Product;
  onClose: () => void;
}

function ProductModal({ product, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        <div className="p-6">
          <ProductDetails product={product} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
