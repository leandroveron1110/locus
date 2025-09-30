// src/components/OrderDetailsModal.tsx
import React from "react";
import OrderDetailsSection from "./OrderDetailsSection";
import { X } from "lucide-react";
import { Order } from "@/features/orders/types/order";
import { formatPrice } from "@/features/common/utils/formatPrice";

interface Props {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
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
              Productos de la Orden #{order.id.substring(0, 8)}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenido del Modal: Solo detalles de productos */}
          <div className="mt-4 space-y-6">
            {/* Sección de Resumen del pedido en el modal */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Fecha:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString("es-AR")}
              </div>
              <div>
                <span className="font-semibold">Total:</span>{" "}
                {formatPrice(order.total)}
              </div>
            </div>

            <hr className="my-4 border-t border-dashed border-gray-200" />

            {/* Sección de Productos */}
            <div>
              <OrderDetailsSection items={order.items}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}