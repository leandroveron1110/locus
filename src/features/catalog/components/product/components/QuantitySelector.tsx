// src/components/QuantitySelector.tsx
import React from "react";
import { Minus, Plus } from "lucide-react";

interface Props {
  count: number;
  increase: () => void;
  decrease: () => void;
}

export default function QuantitySelector({ count, increase, decrease }: Props) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {/* ✅ Se ajusta el tamaño del texto "Unidades" */}
      <span className="font-medium text-sm md:text-base text-gray-700">Unidades</span>

      <div className="flex items-center gap-3">
        {/* Botón disminuir */}
        <button
          onClick={decrease}
          aria-label="Disminuir cantidad"
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>

        {/* ✅ Se ajusta el tamaño del valor numérico */}
        <span
          className="text-lg md:text-xl font-bold text-gray-900 min-w-[2ch] text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {count}
        </span>

        {/* Botón aumentar */}
        <button
          onClick={increase}
          aria-label="Aumentar cantidad"
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 active:scale-95 transition"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}