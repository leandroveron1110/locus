"use client";
import React from "react";
import { Trash2 } from "lucide-react";

interface Props {
  total: number;
  onClear: () => void;
}

export default function CartSummary({ total, onClear }: Props) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
      {/* Total */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Total de la compra</span>
        <span className="text-lg font-semibold text-gray-900">
          ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Botón vaciar */}
      <button
        onClick={onClear}
        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition"
      >
        <Trash2 className="w-4 h-4" />
        Vaciar carrito
      </button>
    </div>
  );
}
