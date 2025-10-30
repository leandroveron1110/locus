// src/components/ProductModal.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { Product } from "../types/catlog";
import ProductDetails from "./product/ProductDetails";
import { createPortal } from "react-dom";

interface ModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      setIsMounted(false);
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Handle CSS transition for closing
  const handleCloseTransition = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove("scale-100", "opacity-100");
      modalRef.current.classList.add("scale-95", "opacity-0");
      setTimeout(onClose, 300); // Wait for the transition to finish
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseTransition();
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseTransition}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        <div className="p-6">
          <ProductDetails product={product} onClose={handleCloseTransition} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default React.memo(ProductModal);