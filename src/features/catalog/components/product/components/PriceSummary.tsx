// src/components/PriceSummary.tsx
import { formatPrice } from "@/features/common/utils/formatPrice";
import React from "react";

interface Props {
  total: number;
  handleAddToCart: () => void;
}

export default function PriceSummary({
  total,
  handleAddToCart,
}: Props) {

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
      {/* Total */}
      <div className="flex justify-between items-center text-base md:text-lg font-semibold text-gray-900">
        <span>Total</span>
        <span>
          {formatPrice(total)}
        </span>
      </div>

      {/* Botón mejorado */}
      <button
        onClick={handleAddToCart}
        aria-label="Agregar producto al carrito"
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm md:text-base hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Agregar al carrito
      </button>
    </div>
  );
}