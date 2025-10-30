// src/components/CatalogSection.tsx
"use client";

import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Product, Section } from "../types/catlog";
import CatalogProduct from "./CatalogProduct";
import ProductModal from "./ProductModal";
import { ChevronDown, ChevronUp, Loader2, Package } from "lucide-react";
import CatalogProductsSkeletonList from "./skeleton/CatalogProductsSkeletonList";
import { fetchProductsBySection } from "../api/products-api";

interface Props {
  section: Section;
  pageSize?: number;
  autoLoad: boolean; // Indica si debe cargar productos al inicio (ej: las primeras 2 secciones)
}

export default function CatalogSection({
  section,
  pageSize = 3,
  autoLoad,
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ESTADOS PARA PAGINACIÓN Y DATOS
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadProducts = useCallback(
    async (currentOffset: number) => {
      try {
        setIsLoading(true);
        const response = await fetchProductsBySection(
          section.id,
          pageSize,
          currentOffset
        );

        if (response) {
          const newProducts: Product[] = response.products;
          setProducts((prev) => [...prev, ...newProducts]);
          setOffset((prev) => prev + pageSize);
          setHasMore(newProducts.length === pageSize);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [section.id, pageSize]
  );

  // CARGA INICIAL SI AUTOLOAD
  useEffect(() => {
    if (!section.id || !autoLoad || products.length > 0 || isLoading) return;

    setProducts([]);
    setOffset(0);
    setHasMore(true);

    loadProducts(0);
  }, [section.id, autoLoad, loadProducts]);

  // HANDLERS
  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    const shouldLoad =
      !autoLoad &&
      isCollapsed &&
      products.length === 0 &&
      hasMore &&
      !isLoading;

    if (shouldLoad) {
      loadProducts(0);
    }

    setIsCollapsed((prev) => !prev);
  }, [isCollapsed, products.length, hasMore, isLoading, loadProducts, autoLoad]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [products]);

  return (
    <div className="mb-12 relative">
      {/* Encabezado clickeable */}
      <div
        className="flex justify-between items-center mb-4 cursor-pointer select-none"
        onClick={handleToggleCollapse}
      >
        <div className="flex items-baseline gap-2">
          <h3 className="font-bold text-gray-900 uppercase text-lg md:text-xl">
            {section.name}
          </h3>
          {products.length > 0 && (
            <span className="text-gray-500 text-sm">{`(${products.length})`}</span>
          )}
        </div>

        {(products.length > 0 || !autoLoad) && (
          <button
            onClick={handleToggleCollapse}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? "Expandir productos" : "Colapsar productos"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 transition-transform duration-200" />
            ) : (
              <ChevronUp className="w-5 h-5 transition-transform duration-200" />
            )}
          </button>
        )}
      </div>

      {/* Lista de productos con animación CSS */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isCollapsed ? "max-h-0" : "max-h-[2000px]"
        }`}
      >
        {/* Skeletons si está cargando */}
        {isLoading && products.length === 0 && (
          <CatalogProductsSkeletonList count={pageSize} />
        )}

        {/* Productos existentes */}
        {products.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <CatalogProduct
                key={product.id}
                product={product}
                onClick={() => handleSelectProduct(product)}
              />
            ))}

            {/* Loader de paginación */}
            {isLoading && products.length > 0 && (
              <li className="col-span-full flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              </li>
            )}

            {/* Botón cargar más */}
            {hasMore && !isLoading && (
              <li className="col-span-full flex justify-center py-4">
                <button
                  onClick={() => loadProducts(offset)}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  Cargar más
                </button>
              </li>
            )}

            {/* Fin de la lista */}
            {!hasMore && (
              <li className="col-span-full flex justify-center py-4 text-gray-500 text-sm">
                No hay más productos para mostrar.
              </li>
            )}
          </ul>
        )}

        {/* Mensaje si no hay productos */}
        {!isLoading && products.length === 0 && !hasMore && (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <Package className="w-12 h-12 mb-2" />
            <p className="text-sm md:text-base text-center">
              No hay productos disponibles en esta sección.
            </p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}
