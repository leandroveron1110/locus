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
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold transition-colors"
        >
          ✕
        </button>

        {/* Contenido */}
        <div className="p-6">
          <h2
            id="cart-item-modal-title"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            Editar producto
          </h2>
          <CartItemEditor item={item} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
