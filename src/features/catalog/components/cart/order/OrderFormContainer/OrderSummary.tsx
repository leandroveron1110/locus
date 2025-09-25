"use client";
import React from "react";
import { formatPrice } from "@/features/common/utils/formatPrice";

interface Props {
  subtotal: number;
  deliveryPrice: number | undefined;
  isPriceLoading: boolean;
  isDelivery: boolean;
  priceZoneMessage?: string;
  orderNote: string;
  setOrderNote: (note: string) => void;
}

export default function OrderSummary({
  subtotal,
  deliveryPrice,
  isPriceLoading,
  isDelivery,
  priceZoneMessage,
  orderNote,
  setOrderNote,
}: Props) {
  const total = subtotal + (deliveryPrice ?? 0);

  return (
    <>
      <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
          Resumen de la Orden
        </h3>

        <div className="space-y-2 text-sm sm:text-base">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {isDelivery && (
            <>
              <div className="flex justify-between text-gray-700">
                <span>Costo de envío</span>
                <span className="font-medium">
                  {isPriceLoading
                    ? "Calculando..."
                    : deliveryPrice !== undefined
                    ? formatPrice(deliveryPrice)
                    : "N/A"}
                </span>
              </div>

              {deliveryPrice === undefined && !isPriceLoading && priceZoneMessage && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 font-semibold">
                  {priceZoneMessage}
                </p>
              )}

              <p className="mt-2 text-xs sm:text-sm text-gray-500 italic">
                El costo de envío es un <strong>precio base</strong> y puede variar si el pedido excede las condiciones estándar (peso, tamaño, etc.).
              </p>
            </>
          )}

          <div className="flex justify-between font-bold text-lg sm:text-xl mt-3 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="notes" className="block font-medium mb-2 text-gray-700 text-sm sm:text-base">
          Notas adicionales para tu pedido
        </label>
        <textarea
          id="notes"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          rows={3}
          className="w-full border rounded-xl p-3 text-sm sm:text-base focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
          placeholder="Ej: Sin cebolla, con extra de salsa..."
        />
      </div>
    </>
  );
}
