"use client";
import React from "react";
import { CartItem } from "../../stores/useCartStore";

interface Props {
  item: CartItem;
  onEdit: (item: CartItem) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, onEdit, onRemove }: Props) {
  return (
    <div
      className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white hover:bg-gray-50 transition"
      onClick={() => onEdit(item)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.product.name}</h3>
          <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
          {item.selectedOptions&&item.selectedOptions?.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc pl-4">
              {item.selectedOptions.map((opt) => (
                <li key={opt.id}>
                  {opt.name} ({opt.value})
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.cartItemId);
          }}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
