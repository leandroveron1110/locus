import React from "react";
import { Clock, Store, MapPin, Copy } from "lucide-react";
import {
  DeliveryType,
  PaymentMethodType,
  OrderStatus,
  PaymentStatus,
  Business,
} from "../../../types/order";

import OrderStatusBadge from "./OrderStatusBadge";

// Mueve las funciones de utilidad fuera del componente
const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getShortId = (id: string) => {
  if (!id) return "";
  return `#${id.substring(0, 8)}`;
};

interface Props {
  orderId: string;
  business: Business;
  deliveryType: DeliveryType;
  paymentType: PaymentMethodType;
  createdAt: string;
  total: number;
  status: OrderStatus;
  paymentStatus?: string;
}

export default function OrderHeader({
  orderId,
  business,
  paymentType,
  createdAt,
  status,
  paymentStatus,
}: Props) {
  // Construir URL para Google Maps de manera más robusta
  const mapsUrl = business.latitude && business.longitude
    ? `http://maps.google.com/?q=${business.latitude},${business.longitude}`
    : `http://maps.google.com/?q=${encodeURIComponent(
        business.address ?? ""
      )}`;

  return (
    <div className="flex flex-col gap-3">
      {/* 🟢 Estado de la orden y ID */}
      <div className="flex items-start justify-between">
        <OrderStatusBadge
          status={status}
          paymentStatus={paymentStatus as PaymentStatus}
          paymentType={paymentType}
        />
        <div className="flex items-center">
          <span className="text-xs text-gray-500 font-mono select-none">
            {getShortId(orderId)}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(orderId)}
            className="ml-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            title="Copiar ID completo"
            aria-label="Copiar ID de la orden"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 🏪 Nombre del negocio */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-900 truncate">
            {business.name}
          </span>
        </div>

        {/* 📍 Dirección clickeable */}
        {business.address && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </a>
        )}
      </div>

      {/* 🕒 Fecha de la orden */}
      <div className="flex justify-between items-center text-sm text-gray-700">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}