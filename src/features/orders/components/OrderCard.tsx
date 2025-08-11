"use client";
import React from "react";
import { Order } from "../types/order";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderItem from "./OrderItem";

interface Props {
  order: Order;
}

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderCard({ order }: Props) {
  return (
    <div className="p-5 bg-white rounded-lg shadow border border-gray-200">
      <h2 className="font-bold text-xl mb-1">
        {order.user.firstName} {order.user.lastName}
      </h2>

      <p className="text-xs text-gray-500 mb-3">
        Orden ID: {order.id} | Negocio: {order.businessId} <br />
        Creada: {formatDate(order.createdAt)}
      </p>

      <div className="mb-3">
        Estado: <OrderStatusBadge status={order.status} />
      </div>

      <p className="mb-4 font-semibold text-lg">Total: ${order.total.toFixed(2)}</p>

      <div className="space-y-3 text-gray-700 text-sm">
        {order.items.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
