// src/components/PriceSummary.tsx
import { Product } from "@/features/catalog/types/catlog";
import React from "react";

interface Props {
  total: number;
  currencyMask: Product["currencyMask"];
  handleAddToCart: () => void;
}

export default function PriceSummary({
  total,
  currencyMask,
  handleAddToCart,
}: Props) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      {/* Total */}
      <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
        <span>Total</span>
        <span>
          {currencyMask} {total.toLocaleString("es-AR")}
        </span>
      </div>

      {/* Botón agregar */}
      <button
        onClick={handleAddToCart}
        aria-label="Agregar producto al carrito"
        className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-base hover:bg-blue-700 active:scale-95 transition-transform"
      >
        Agregar al carrito
      </button>
    </div>
  );
}
