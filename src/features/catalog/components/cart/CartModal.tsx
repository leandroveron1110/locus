"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import CartList from "./CartList";
import { createPortal } from "react-dom";
import { BusinessPaymentMethod } from "../../types/business";

interface Props {
  userId?: string;
  businessId: string;
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessAddresslatitude: number;
  businessAddresslongitude: number;
  businessPaymentMethod?: BusinessPaymentMethod[];
}

export default function CartModal({
  userId,
  businessId,
  businessName,
  businessPaymentMethod,
  isOpen,
  businessAddress,
  businessAddresslatitude,
  businessAddresslongitude,
  businessPhone,
  onClose,
}: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg h-[92vh] sm:h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b bg-white">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Tu carrito
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
          <CartList
            userId={userId}
            businessId={businessId}
            businessAddress={businessAddress}
            businessAddresslatitude={businessAddresslatitude}
            businessAddresslongitude={businessAddresslongitude}
            businessName={businessName}
            businessPhone={businessPhone}
            businessPaymentMethod={businessPaymentMethod}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-gray-700 text-sm">
            <span className="font-medium">Revisa tu pedido</span> antes de confirmar.
          </div>
          <button
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium shadow-md transition"
            onClick={onClose}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
