// src/components/PaymentModal.tsx
import React from "react";
import { Order } from "@/features/orders/types/order";
import { X } from "lucide-react";
import TransferPaymentSection from "./TransferPaymentSection";

interface Props {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({
  order,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
        <div className="p-6">
          {/* Encabezado del Modal */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Gestión de Pago
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenido: TransferPaymentSection */}
          <div className="mt-4 space-y-6">
            <TransferPaymentSection
              orderId={order.id}
              businessId={order.businessId}
              paymentStatus={order.paymentStatus}
              paymentReceiptUrl={order.paymentReceiptUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}