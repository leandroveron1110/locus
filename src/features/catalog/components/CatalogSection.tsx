// src/components/CatalogSection.tsx
"use client";

import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Product, Section } from "../types/catlog";
import CatalogProduct from "./CatalogProduct";
import ProductModal from "./ProductModal";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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

  // 1. ESTADOS PARA PAGINACIÓN Y DATOS
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadProducts = useCallback(
    async (currentOffset: number) => {
      try {
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

  useEffect(() => {
    if (!section.id || !autoLoad || products.length > 0 || isLoading) return;

    setProducts([]);
    setOffset(0);
    setHasMore(true);
    setIsLoading(true);

    loadProducts(0);
  }, [section.id, autoLoad]);

  // 4. HANDLERS de Interacción
  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    // Condición: Si NO cargó automáticamente Y se está expandiendo Y no hay productos cargados
    const shouldLoad =
      !autoLoad &&
      isCollapsed &&
      products.length === 0 &&
      hasMore &&
      !isLoading;

    // Si cumple la condición de Lazy Load, dispara la carga
    if (shouldLoad) {
      // Usa el offset 0 porque es la primera carga después de expandir
      loadProducts(0);
    }

    // Siempre alterna el estado de colapsado
    setIsCollapsed((prev) => !prev);
  }, [
    isCollapsed,
    products.length,
    hasMore,
    isLoading,
    loadProducts,
    autoLoad,
  ]);

  // 5. ORDENAMIENTO
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [products]);

  // 6. RENDERIZADO
  return (
    <div className="mb-12 relative">
      {/* ⬅️ Encabezado con Nombre y Conteo */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-baseline gap-2">
          <h3 className="font-bold text-gray-900 leading-tight text-gray-800">
            {section.name.toUpperCase()}
          </h3>
        </div>

        {/* Botón de colapsar/expandir */}
        {/* Mostramos el botón si hay productos cargados, si sabemos el total, o si no cargamos automáticamente */}
        {(products.length > 0 || !autoLoad) && (
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

      {/* ⬅️ Lista de Productos O Lista de Esqueletos */}
      {!isCollapsed && (
        <>
          {/* CONDICIÓN 1: Mostrar esqueletos si estamos cargando Y no tenemos productos */}
          {isLoading && products.length === 0 && (
            <CatalogProductsSkeletonList count={pageSize} />
          )}

          {/* CONDICIÓN 2: Mostrar productos si ya tenemos datos */}
          {products.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <CatalogProduct
                  key={product.id}
                  product={product}
                  onClick={() => handleSelectProduct(product)}
                />
              ))}

              {/* Indicador de carga para paginación */}
              {isLoading && products.length > 0 && (
                <li className="col-span-full flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                </li>
              )}

              {/* Botón "Cargar Más" */}
              {hasMore && !isLoading && (
                <li className="col-span-full flex justify-center py-4">
                  <button
                    onClick={() => loadProducts(offset)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cargar más productos
                  </button>
                </li>
              )}

              {/* Mensaje de fin */}
              {!hasMore && (
                <li className="col-span-full flex justify-center py-4 text-gray-500 text-sm">
                  No hay más productos para mostrar.
                </li>
              )}
            </ul>
          )}

          {/* Mensaje si la sección está vacía y ya se intentó cargar */}
          {!isLoading && products.length === 0 && !hasMore && (
            <p className="flex justify-center py-4 text-gray-500 text-sm">
              No hay productos disponibles en esta sección.
            </p>
          )}
        </>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
}
