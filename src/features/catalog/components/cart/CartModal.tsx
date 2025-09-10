"use client";

import React from "react";
import { X } from "lucide-react";
import CartList from "./CartList";
import { BusinessPaymentMethod } from "../../types/business";

interface Props {
  userId?: string;
  businessId: string;
  businessAddress: string;
  businessName: string;
  businessPhone: string;
  businessPaymentMethod: BusinessPaymentMethod[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({
  userId,
  businessId,
  businessAddress,
  businessName,
  businessPhone,
  businessPaymentMethod,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen) return null; // si no está abierto, no se renderiza nada

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Tu carrito</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <CartList
            userId={userId}
            businessId={businessId}
            businessAddress={businessAddress}
            businessName={businessName}
            businessPhone={businessPhone}
            businessPaymentMethod={businessPaymentMethod}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-white flex justify-end gap-3">
          {/* Total / botones de acción */}
        </div>
      </div>
    </div>
  );
}
