"use client";
import React from "react";
import { CartItem } from "../../stores/useCartStore";
import { Trash2 } from "lucide-react";

interface Props {
  item: CartItem;
  onEdit: (item: CartItem) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, onEdit, onRemove }: Props) {
  const hasOptions = item.selectedOptions && item.selectedOptions.length > 0;

  // 🔹 Calcular el precio total del ítem
  const basePrice = parseFloat(String(item.product.finalPrice)) || 0;
  const optionsPrice =
    item.selectedOptions?.reduce(
      (acc, opt) => acc + (parseFloat(opt.value) || 0),
      0
    ) || 0;

  const totalItemPrice = (basePrice + optionsPrice) * item.quantity;

  return (
    <div
      className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
      onClick={() => onEdit(item)}
    >
      {/* Imagen producto */}
      {item.product.imageUrl ? (
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          📦
        </div>
      )}

      {/* Info producto */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>

        {hasOptions && (
          <ul className="mt-1 text-sm text-gray-600 space-y-0.5">
            {item.selectedOptions!.map((opt) => (
              <li key={opt.id} className="flex items-center gap-1">
                <span className="font-medium">{opt.name}:</span>
                <span>
                  {opt.value !== "0"
                    ? `+ $${parseFloat(opt.value).toLocaleString("es-AR")}`
                    : "Incluido"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Precio + eliminar */}
      <div className="flex flex-col items-end gap-2">
        <p className="text-sm font-semibold text-indigo-600">
          ${totalItemPrice.toLocaleString("es-AR")}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.cartItemId);
          }}
          className="p-1 rounded-full hover:bg-red-50 transition"
          aria-label="Eliminar"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
