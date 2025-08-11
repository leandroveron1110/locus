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
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
        <div className="p-6">
          <CartItemEditor item={item} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
