"use client";
import React from "react";
import { CartItem } from "../../stores/useCartStore";
import { Package, Trash2 } from "lucide-react";
import { formatPrice } from "@/features/common/utils/formatPrice";

interface Props {
  item: CartItem;
  onEdit: (item: CartItem) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, onEdit, onRemove }: Props) {
  const hasOptions = item.selectedOptions && item.selectedOptions.length > 0;

  const basePrice = Number(item.product.finalPrice) || 0;
  const optionsPrice =
    item.selectedOptions?.reduce(
      (acc, opt) => acc + (Number(opt.value) || 0),
      0
    ) || 0;
  const totalItemPrice = (basePrice + optionsPrice) * item.quantity;

  return (
    <div
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onEdit(item)}
    >
      {/* Imagen */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <Package className="w-12 h-12 text-gray-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>

        {hasOptions && (
          <ul className="mt-1 text-xs text-gray-600 space-y-0.5">
            {item.selectedOptions!.map((opt) => (
              <li key={opt.id} className="flex justify-between">
                <span className="font-medium">{opt.name}:</span>
                <span className="text-gray-500 font-normal">
                  {opt.value !== 0 ? `+ ${formatPrice(opt.value)}` : "Incluido"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Precio + eliminar */}
      <div className="flex flex-col items-end gap-2">
        <p className="text-base md:text-lg font-semibold text-gray-900">
          {formatPrice(totalItemPrice)}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.cartItemId);
          }}
          className="p-2 rounded-full hover:bg-red-50 transition"
          aria-label="Eliminar"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
