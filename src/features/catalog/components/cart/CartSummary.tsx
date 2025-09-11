"use client";
import React from "react";
import { Trash2 } from "lucide-react";

interface Props {
  total: number;
  onClear: () => void;
}

export default function CartSummary({ total, onClear }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-200 gap-4">
      {/* Total */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Total de la compra</span>
        <span className="text-3xl font-bold text-gray-900">
          ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Botón vaciar (estilo ghost) */}
      <button
        onClick={onClear}
        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition"
      >
        <Trash2 className="w-4 h-4" />
        Vaciar carrito
      </button>
    </div>
  );
}
