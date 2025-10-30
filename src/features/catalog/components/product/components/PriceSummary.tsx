import { formatPrice } from "@/features/common/utils/formatPrice";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface Props {
  total: number;
  handleAddToCart: () => void;
}

export default function PriceSummary({ total, handleAddToCart }: Props) {
  return (
    <div className="w-full to-gray- overflow-hidden transition-all duration-300 hover:shadow-lg">

      {/* Contenido */}
      <div className="flex flex-col gap-4">
        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-base md:text-lg font-medium">
            Total
          </span>
          <span className="font-semibold tracking-tight">
            {formatPrice(total)}
          </span>
        </div>

        {/* Botón */}
        <button
          onClick={handleAddToCart}
          aria-label="Agregar producto al carrito"
          className="group w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl 
          bg-blue-600 text-white font-semibold text-base transition-all duration-200 
          hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
          <span>Agregar al carrito</span>
        </button>
      </div>
    </div>
  );
}
