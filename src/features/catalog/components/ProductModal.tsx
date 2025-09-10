// src/components/ProductModal.tsx
"use client";

import React, { useEffect } from "react";
import { Product } from "../types/catlog";
import ProductDetails from "./product/ProductDetails";
import { createPortal } from "react-dom";

interface ModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ModalProps) => {
  useEffect(() => {
    // Evita el scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden";
    // Agrega un listener para cerrar el modal con la tecla 'Escape'
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    // Limpia los efectos al desmontar el componente
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transform transition-transform duration-300 scale-95 opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100"
        role="document"
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el modal
        data-state="open"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        <div className="p-6">
          <ProductDetails product={product} onClose={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default React.memo(ProductModal);