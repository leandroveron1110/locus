"use client";

import React, { useState } from "react";
import {
  Order,
  PaymentMethodType,
  DeliveryType,
  PaymentStatus,
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

  const showPaymentButton = order.paymentType === PaymentMethodType.TRANSFER;

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

  const getPaymentButtonText = () =>
    order.paymentStatus === PaymentStatus.PENDING
      ? "Realizar pago"
      : "Ver comprobante";

  const getPaymentButtonHint = () =>
    order.paymentStatus === PaymentStatus.PENDING
      ? "Carga el comprobante y completa el pago aquí."
      : "Consulta el comprobante de la transferencia realizada.";

  return (
    <>
      <div className="h-full flex flex-col bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
        <div className="flex flex-col flex-grow p-4 sm:p-6">
          {/* Encabezado principal */}
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

          {/* Información de entrega, pago y envío */}
          <div className="flex flex-col gap-3">
            {/* Entrega */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Truck size={18} className="text-blue-600" />
              </div>
              <div className="flex-grow">
                <span className="text-xs text-gray-500 font-medium block">
                  Entrega
                </span>
                <span className="text-sm font-semibold text-gray-900 block">
                  {getDeliveryText(order.deliveryType)}
                </span>
              </div>
            </div>

            {/* Pago */}
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
              <div className="p-2 bg-emerald-100 rounded-full">
                <DollarSign size={18} className="text-emerald-600" />
              </div>
              <div className="flex-grow">
                <span className="text-xs text-gray-500 font-medium block">
                  Pago
                </span>
                <span className="text-sm font-semibold text-gray-900 block">
                  {getPaymentText(order.paymentType)}
                </span>
              </div>
            </div>

            {/* Envío */}
            {order.deliveryCompany?.totalDelivery && (
              <div className="flex flex-col gap-2 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <DollarSign size={18} className="text-yellow-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-500 font-medium">
                        Envío
                      </span>
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {order.deliveryCompany.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(Number(order.deliveryCompany.totalDelivery))}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Este es el valor base, puede variar según la cadetería.
                </span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">
                Total del pedido
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(order.total)}
              </span>
            </div>
            {
              order.deliveryCompany?.totalDelivery && (<p className="text-xs text-gray-400 italic mt-1">
              * Envío no incluido, se abona al cadete.
            </p>)
            }
            
          </div>

          {/* Botón ver productos */}
          <div
            className="mt-3 flex items-center justify-end cursor-pointer"
            onClick={() => setIsDetailsModalOpen(true)}
          >
            <span className="text-sm font-medium text-blue-600">
              Ver productos
            </span>
            <ChevronRight size={16} className="ml-1 text-blue-600" />
          </div>

          {/* Botón de pago minimalista */}
          {showPaymentButton && (
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-xs text-gray-500 leading-snug pl-1">{getPaymentButtonHint()}</p>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className={`self-start px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${
                    order.paymentStatus === PaymentStatus.PENDING
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
              >
                {getPaymentButtonText()}
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
