"use client";

import React, { useState } from "react";
import { Product, Section } from "../types/catlog";
import CatalogProduct from "./CatalogProduct";
import ProductDetails from "./ProductDetails";

interface Props {
  section: Section;
}

export default function CatalogSection({ section }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="mb-12 relative">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        {section.name}
      </h3>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.products.map((product) => (
          <CatalogProduct
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </ul>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <div className="p-6">
              <ProductDetails product={selectedProduct} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
