"use client";

import React, { useState } from "react";
import {
  Order,
  PaymentMethodType,
  DeliveryType,
  PaymentStatus,
  OrderStatus,
} from "../../types/order";
import OrderHeader from "./components/OrderHeader";
import { ChevronRight, Truck, DollarSign } from "lucide-react";
import OrderDetailsModal from "./components/OrderDetailsModal";
import PaymentModal from "./components/PaymentModal";
import { formatPrice } from "@/features/common/utils/formatPrice";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Determinar si el botón para el modal de pago debe mostrarse
  const showPaymentButton = order.paymentType === PaymentMethodType.TRANSFER;

  // Helper para determinar el texto de entrega
  const getDeliveryText = (type: DeliveryType) => {
    switch (type) {
      case DeliveryType.PICKUP:
        return "Retiro en el local";
      case DeliveryType.DELIVERY:
      case DeliveryType.IN_HOUSE_DELIVERY:
      case DeliveryType.EXTERNAL_DELIVERY:
        return "Entrega a domicilio";
      default:
        return "Tipo de entrega no definido";
    }
  };

  // Helper para determinar el texto del método de pago
  const getPaymentText = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CASH:
        return "Efectivo";
      case PaymentMethodType.TRANSFER:
        return "Transferencia";
      default:
        return "Método de pago no definido";
    }
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:border-blue-300">
        <div className="p-4 sm:p-6">
          {/* Encabezado Principal */}
          <div
            className="cursor-pointer"
            onClick={() => setIsDetailsModalOpen(true)}
          >
            <OrderHeader
              business={order.business}
              createdAt={order.createdAt}
              deliveryType={order.deliveryType}
              orderId={order.id}
              paymentType={order.paymentType}
              status={order.status}
              total={order.total}
              paymentStatus={order.paymentStatus}
            />
          </div>

          <hr className="my-4 border-t border-dashed border-gray-200" />

          {/* Cards de Entrega, Pago y Envío */}
          <div className="flex flex-col gap-4">
            {/* Tarjeta de Entrega */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
                <Truck size={18} className="text-blue-600" />
              </div>
              <div className="flex-grow">
                <span className="text-xs text-gray-500 font-medium block">
                  Entrega
                </span>
                <span className="font-semibold text-sm text-gray-900 truncate block">
                  {getDeliveryText(order.deliveryType)}
                </span>
              </div>
            </div>

            {/* Tarjeta de Pago */}
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
              <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-full">
                <DollarSign size={18} className="text-emerald-600" />
              </div>
              <div className="flex-grow">
                <span className="text-xs text-gray-500 font-medium block">
                  Pago
                </span>
                <span className="font-semibold text-sm text-gray-900 truncate block">
                  {getPaymentText(order.paymentType)}
                </span>
              </div>
            </div>

            {/* Tarjeta de Envío Mejorada */}
            {/* Tarjeta de Envío Mejorada con Aclaración Arriba */}
            {order.deliveryCompany && order.deliveryCompany.totalDelivery && (
              <div className="flex flex-col gap-2 p-3 bg-yellow-50 rounded-lg shadow-sm">
                {/* Contenido principal: icono + cadetería + precio */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-full">
                      <DollarSign size={18} className="text-yellow-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-500 font-medium">
                        Envío
                      </span>
                      <span className="font-semibold text-sm text-gray-900 truncate">
                        {order.deliveryCompany.name}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className="font-semibold text-sm text-gray-900">
                      {formatPrice(Number(order.deliveryCompany.totalDelivery))}
                    </span>
                  </div>
                </div>
                {/* Texto aclaratorio arriba */}
                <span className="text-xs text-gray-500">
                  Este el valor base del envío, puede variar según las reglas de
                  la cadetería.
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 font-medium">
                Total del pedido
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(order.total)}
              </span>
            </div>
            <div className="text-xs text-gray-400 italic">
              * El envío se paga al cadete y no está incluido en este total
            </div>
          </div>

          {/* Botón para ver productos */}
          <div
            className="mt-4 flex items-center justify-end cursor-pointer"
            onClick={() => setIsDetailsModalOpen(true)}
          >
            <span className="text-sm font-medium text-blue-600">
              Ver productos
            </span>
            <ChevronRight size={16} className="ml-1 text-blue-600" />
          </div>

          {/* Botón de gestionar pago si es transferencia */}
          {showPaymentButton && (
            <div className="mt-4 flex justify-center sm:justify-end">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2 rounded-full font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Gestionar Pago
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <OrderDetailsModal
        order={order}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {showPaymentButton && (
        <PaymentModal
          order={order}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
    </>
  );
}
