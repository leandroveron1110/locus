"use client";
import React from "react";

interface Props {
  total: number;
  onClear: () => void;
}

export default function CartSummary({ total, onClear }: Props) {
  console.log(total)
  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-xl font-bold text-gray-800">
        Total: ${total.toFixed(2)}
      </div>
      <button
        onClick={onClear}
        className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Vaciar carrito
      </button>
    </div>
  );
}
