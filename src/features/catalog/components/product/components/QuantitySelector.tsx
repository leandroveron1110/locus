import React from "react";
import { Minus, Plus } from "lucide-react";

interface Props {
  count: number;
  increase: () => void;
  decrease: () => void;
}

export default function QuantitySelector({ count, increase, decrease }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 w-full bg-white ">
      {/* Label */}
      <span className="text-gray-700 font-medium text-sm md:text-base">
        Unidades
      </span>

      {/* Controles */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-full border border-gray-200 overflow-hidden">
        {/* Disminuir */}
        <button
          onClick={decrease}
          aria-label="Disminuir Unidades"
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-transform duration-150"
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>

        {/* Número */}
        <span
          className="text-sm font-bold text-gray-900 min-w-[2ch] text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {count}
        </span>

        {/* Aumentar */}
        <button
          onClick={increase}
          aria-label="Aumentar Unidades"
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-transform duration-150"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
