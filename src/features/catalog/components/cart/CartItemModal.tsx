"use client";
import React from "react";
import { CartItem } from "../../stores/useCartStore";
import CartItemEditor from "./CartItemEditor";

interface Props {
  item: CartItem;
  onClose: () => void;
}

export default function CartItemModal({ item, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-item-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto relative transform transition-all duration-300">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 p-1 rounded-full transition-colors"
        >
          ✕
        </button>

        {/* Contenido */}
        <div className="p-5 sm:p-6">
          <h2
            id="cart-item-modal-title"
            className="text-lg sm:text-xl font-semibold text-gray-900 mb-4"
          >
            Editar producto
          </h2>
          <CartItemEditor item={item} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
