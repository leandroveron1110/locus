// src/components/components/OrderHeader.tsx
import React, { useMemo } from "react";
import {
  Clock,
  MapPin,
  Store,
  Truck,
  DollarSign,
  Wallet,
  Clipboard,
} from "lucide-react";
import {
  DeliveryType,
  PaymentMethodType,
  OrderStatus,
  PaymentStatus,
} from "../../../types/order";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  orderId: string;
  businessName: string;
  businessAddress: string;
  deliveryType: DeliveryType;
  paymentType: PaymentMethodType;
  createdAt: string;
  total: number;
  status: OrderStatus;
  paymentStatus?: string;
}

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getDeliveryInfo = (deliveryType: DeliveryType) => {
  switch (deliveryType) {
    case DeliveryType.PICKUP:
      return {
        icon: <Store className="w-4 h-4 mr-2" />,
        text: "Retiro en el local",
      };
    default:
      return {
        icon: <Truck className="w-4 h-4 mr-2" />,
        text: "Envío a domicilio",
      };
  }
};

const getPaymentInfo = (paymentType: PaymentMethodType) => {
  switch (paymentType) {
    case PaymentMethodType.CASH:
      return {
        icon: <DollarSign className="w-4 h-4 mr-2" />,
        text: "Efectivo",
      };
    case PaymentMethodType.TRANSFER:
      return {
        icon: <Wallet className="w-4 h-4 mr-2" />,
        text: "Transferencia",
      };
    case PaymentMethodType.DELIVERY:
      return {
        icon: <Clipboard className="w-4 h-4 mr-2" />,
        text: "Pago al delivery",
      };
    default:
      return { icon: null, text: "Método de pago no definido" };
  }
};

export default function OrderHeader({
  orderId,
  businessName,
  businessAddress,
  deliveryType,
  paymentType,
  createdAt,
  total,
  status,
  paymentStatus,
}: Props) {
  const deliveryInfo = useMemo(
    () => getDeliveryInfo(deliveryType),
    [deliveryType]
  );
  const paymentInfo = useMemo(() => getPaymentInfo(paymentType), [paymentType]);

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    businessAddress
  )}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Header: negocio + total */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        {/* Info principal */}
        {/* <span className="truncate">{orderId}</span> */}
        <div className="flex flex-col gap-1 min-w-0">

          <h2 className="flex items-center font-semibold text-gray-900 text-base leading-tight truncate">
            <Store className="w-5 h-5 mr-2 text-gray-500 flex-shrink-0" />
            <span className="truncate">{businessName}</span>
          </h2>
          <p className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{formatDate(createdAt)}</span>
          </p>
          
        </div>

        {/* Total + Status */}
        <div className="flex flex-col items-start sm:items-end gap-1 sm:flex-shrink-0">
          <p className="font-bold text-xl text-gray-900 leading-tight whitespace-nowrap">
            ${total.toFixed(2)}
          </p>
          <OrderStatusBadge
            status={status}
            paymentStatus={paymentStatus as PaymentStatus}
            paymentType={paymentType}
          />
        </div>
      </div>

          <div className="flex items-center gap-2">
            <span className="truncate font-mono text-sm text-gray-700">
              {orderId}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(orderId)}
              className="text-gray-500 hover:text-gray-900 transition-colors"
              title="Copiar ID"
            >
              📋
            </button>
          </div>

      {/* Detalles del Pedido */}
      <div className="flex flex-col gap-2 pt-4 border-t border-dashed">
        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-1 min-w-0">
          {deliveryInfo.icon}
          <span className="truncate">{deliveryInfo.text}</span>
          {deliveryType === DeliveryType.PICKUP && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline ml-2 flex-shrink-0"
            >
              <MapPin className="w-3 h-3 mr-1" />
              Ver dirección
            </a>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600 min-w-0">
          {paymentInfo.icon}
          <span className="truncate">{paymentInfo.text}</span>
        </div>
      </div>
    </div>
  );
}
