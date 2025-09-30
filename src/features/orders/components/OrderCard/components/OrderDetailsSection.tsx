// src/components/OrderDetailsSection.tsx
import { OrderItem } from "@/features/orders/types/order";
import React from "react";
import Image from "next/image"; // ⬅️ Importamos el componente Image de Next.js
import { formatPrice } from "@/features/common/utils/formatPrice";

interface Props {
  items: OrderItem[];
}

export default function OrderDetailsSection({ items }: Props) {

  // Función corregida para calcular el precio total de un ítem
  const calculateItemTotal = (item: OrderItem) => {
    const optionsPrice = item.optionGroups
      ? item.optionGroups.reduce((acc, group) => {
          const groupOptionsPrice = group.options.reduce(
            (optionAcc, option) => optionAcc + option.priceFinal,
            0
          );
          return acc + groupOptionsPrice;
        }, 0)
      : 0;

    return (item.priceAtPurchase + optionsPrice) * item.quantity;
  };

  return (
    <div className="space-y-6 pt-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-gray-50 transition-colors"
        >
          {/* Contenedor de la imagen del producto */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white overflow-hidden border border-gray-200 shadow-sm relative"> {/* ⬅️ Añadimos 'relative' */}
            {item.productImageUrl ? (
              <Image
                src={item.productImageUrl}
                alt={`Imagen de ${item.productName}`}
                fill // ⬅️ Usamos fill para que la imagen ocupe todo el contenedor
                className="object-cover"
                sizes="100px" // ⬅️ Indicamos un tamaño aproximado para la optimización
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
                Sin imagen
              </div>
            )}
          </div>

          {/* Detalles del producto y opciones */}
          <div className="flex-grow flex-shrink-0 w-full sm:w-auto">
            <h4 className="font-semibold text-gray-900 text-base">
              {item.productName}
            </h4>
            <p className="text-sm text-gray-500">
              {item.quantity} x {formatPrice(item.priceAtPurchase)}
            </p>

            {/* Opciones del producto */}
            {item.optionGroups && item.optionGroups.length > 0 && (
              <div className="mt-2 space-y-1">
                {item.optionGroups.map((group) => (
                  <div key={group.id} className="text-xs text-gray-600">
                    <p className="font-medium text-gray-700">
                      {group.groupName}
                    </p>
                    {group.options.map((option) => (
                      <p key={option.id} className="text-gray-500 ml-2">
                        + {option.optionName}
                        {option.priceFinal > 0 && (
                          <span className="ml-1">
                            ({formatPrice(option.priceFinal)})
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Precio total del ítem */}
          <span className="text-lg font-bold text-gray-900 flex-shrink-0 ml-auto mt-2 sm:mt-0">
            {formatPrice(calculateItemTotal(item))}
          </span>
        </div>
      ))}
    </div>
  );
}