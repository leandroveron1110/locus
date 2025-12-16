"use client";
import React from "react";
import { formatPrice } from "@/features/common/utils/formatPrice";

interface PaymentBreakdown {
  cash: number;
  transfer: number;
  qr: number;
  delivery: number | null | undefined;
  total: number;
}

interface Props {
  paymentBreakdown: PaymentBreakdown;

  isDelivery: boolean;
  priceZoneMessage?: string;
  orderNote: string;
  setOrderNote: (note: string) => void;
}

export default function OrderSummary({
  paymentBreakdown,
  isDelivery,
  priceZoneMessage,
  orderNote,
  setOrderNote,
}: Props) {

  const { cash, transfer, qr, delivery, total } = paymentBreakdown;

  return (
    <>
      {/* 🧾 Resumen de la orden */}
      <div className="mt-6 p-4 sm:p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
          Resumen del Pago
        </h3>

        <div className="space-y-2 text-sm sm:text-base">

          {/* 💵 Pago en efectivo */}
          {cash > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Pagás en efectivo</span>
              <span className="font-medium">{formatPrice(cash)}</span>
            </div>
          )}

          {/* 🏦 Transferencia */}
          {transfer > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Pagás por transferencia</span>
              <span className="font-medium">{formatPrice(transfer)}</span>
            </div>
          )}

          {/* 📱 QR */}
          {qr > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Pagás por QR</span>
              <span className="font-medium">{formatPrice(qr)}</span>
            </div>
          )}
        
          {/* 🛵 Delivery */}
          {isDelivery && delivery && (
            <div className="flex justify-between text-gray-700">
              <span>Pagás al cadete</span>
              <span className="font-medium">
                {delivery ? formatPrice(delivery) : "A confirmar"}
              </span>
            </div>
          )}

          {isDelivery && delivery === 0 && priceZoneMessage && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 font-semibold">
              {priceZoneMessage}
            </p>
          )}

          {/* TOTAL */}
          <div className="flex justify-between font-bold text-lg sm:text-xl mt-4 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* 📝 Notas del pedido */}
      <div className="mt-6">
        <label
          htmlFor="notes"
          className="block font-medium mb-2 text-gray-700 text-sm sm:text-base"
        >
          Notas adicionales para tu pedido
        </label>
        <textarea
          id="notes"
          aria-label="Notas adicionales para el pedido"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          rows={3}
          className="w-full border rounded-xl p-3 text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-none transition-colors"
          placeholder="Ej: Sin cebolla, con extra de salsa..."
        />
      </div>
    </>
  );
}
