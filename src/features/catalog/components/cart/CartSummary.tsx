"use client";
import React from "react";
import { Trash2 } from "lucide-react";

interface Props {
  total: number;
  onClear: () => void;
}

export default function CartSummary({ total, onClear }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 border rounded-xl shadow-sm bg-white gap-3">
      {/* Total */}
      <div className="text-lg sm:text-xl font-bold text-gray-900">
        Total:{" "}
        <span className="text-indigo-600">
          ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Botón vaciar */}
      <button
        onClick={onClear}
        className="flex items-center gap-2 text-sm font-medium bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
      >
        <Trash2 className="w-4 h-4" />
        Vaciar carrito
      </button>
    </div>
  );
}
