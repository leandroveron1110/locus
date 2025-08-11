"use client";
import React from "react";
import { OrderStatus } from "../types/order";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

interface Props {
  status: OrderStatus | string;
}

const statusMap: Record<
  OrderStatus,
  { label: string; color: string; Icon: React.FC<any> }
> = {
  [OrderStatus.PENDING]: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800",
    Icon: Clock,
  },
  [OrderStatus.CONFIRMED]: {
    label: "Confirmada",
    color: "bg-blue-100 text-blue-800",
    Icon: CheckCircle,
  },
  [OrderStatus.IN_DELIVERY]: {
    label: "En reparto",
    color: "bg-indigo-100 text-indigo-800",
    Icon: Truck,
  },
  [OrderStatus.DELIVERED]: {
    label: "Entregada",
    color: "bg-green-100 text-green-800",
    Icon: Package,
  },
  [OrderStatus.CANCELLED]: {
    label: "Cancelada",
    color: "bg-red-100 text-red-800",
    Icon: XCircle,
  },
};

export default function OrderStatusBadge({ status }: Props) {
  const s = statusMap[status as OrderStatus];

  if (!s) {
    return (
      <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded">
        {status}
      </span>
    );
  }

  const Icon = s.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${s.color}`}
    >
      <Icon size={14} />
      {s.label}
    </span>
  );
}
