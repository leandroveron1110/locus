"use client";
import React, { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import {
  Order,
  OrderStatus,
  PaymentMethodType,
  PaymentStatus,
} from "../types/order";
import OrderCard from "./OrderCard/OrderCard";
import OrdersFilters from "./OrdersFilters";
import EmptyState from "./EmptyState";

interface OrdersListProps {
  userId: string;
}

const statusPriority: Record<OrderStatus, number> = {
  [OrderStatus.PENDING]: 1,
  [OrderStatus.WAITING_FOR_PAYMENT]: 2,
  [OrderStatus.PAYMENT_IN_PROGRESS]: 3,
  [OrderStatus.PAYMENT_CONFIRMED]: 4,
  [OrderStatus.PENDING_CONFIRMATION]: 5,
  [OrderStatus.CONFIRMED]: 6,
  [OrderStatus.PREPARING]: 7,
  [OrderStatus.REJECTED_BY_BUSINESS]: 20,
  [OrderStatus.READY_FOR_CUSTOMER_PICKUP]: 8,
  [OrderStatus.READY_FOR_DELIVERY_PICKUP]: 9,
  [OrderStatus.DELIVERY_PENDING]: 10,
  [OrderStatus.DELIVERY_ASSIGNED]: 11,
  [OrderStatus.DELIVERY_ACCEPTED]: 12,
  [OrderStatus.DELIVERY_REJECTED]: 21,
  [OrderStatus.DELIVERY_REASSIGNING]: 13,
  [OrderStatus.OUT_FOR_PICKUP]: 14,
  [OrderStatus.PICKED_UP]: 15,
  [OrderStatus.OUT_FOR_DELIVERY]: 16,
  [OrderStatus.DELIVERED]: 30,
  [OrderStatus.DELIVERY_FAILED]: 22,
  [OrderStatus.RETURNED]: 23,
  [OrderStatus.REFUNDED]: 40,
  [OrderStatus.COMPLETED]: 50,
  [OrderStatus.CANCELLED_BY_USER]: 60,
  [OrderStatus.CANCELLED_BY_BUSINESS]: 61,
  [OrderStatus.CANCELLED_BY_DELIVERY]: 62,
  [OrderStatus.FAILED]: 70,
};

const quickFilters = [
  { label: "Todos", statuses: [] },
  { label: "Pendientes", statuses: [OrderStatus.PENDING] },
  {
    label: "Pago pendiente",
    statuses: [OrderStatus.WAITING_FOR_PAYMENT, OrderStatus.PENDING],
  },
  {
    label: "En preparación",
    statuses: [OrderStatus.PREPARING, OrderStatus.CONFIRMED],
  },
  {
    label: "Listo para retiro en local",
    statuses: [OrderStatus.READY_FOR_CUSTOMER_PICKUP],
  },
  {
    label: "Listo para entrega a repartidor",
    statuses: [OrderStatus.READY_FOR_DELIVERY_PICKUP],
  },
  {
    label: "En camino",
    statuses: [
      OrderStatus.DELIVERY_ASSIGNED,
      OrderStatus.DELIVERY_ACCEPTED,
      OrderStatus.OUT_FOR_PICKUP,
      OrderStatus.PICKED_UP,
      OrderStatus.OUT_FOR_DELIVERY,
    ],
  },
  {
    label: "Entregados",
    statuses: [OrderStatus.DELIVERED, OrderStatus.COMPLETED],
  },
];

export default function OrdersList({ userId }: OrdersListProps) {
  const orders: Order[] = useOrders(userId);
  const [activeFilter, setActiveFilter] = useState<string>("Todos");

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "Todos") return true;

    const filterStatuses =
      quickFilters.find((f) => f.label === activeFilter)?.statuses || [];

    const matchOrderStatus = filterStatuses.includes(order.status);

    if (activeFilter === "Pago pendiente") {
      return (
        matchOrderStatus &&
        order.paymentType === PaymentMethodType.CASH &&
        (order.paymentStatus === PaymentStatus.PENDING ||
          order.paymentStatus === PaymentStatus.IN_PROGRESS)
      );
    }

    return matchOrderStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const priorityDiff =
      (statusPriority[a.status] ?? 999) - (statusPriority[b.status] ?? 999);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="m bg-white rounded-xl shadow p-4 sm:p-6">
      <OrdersFilters
        ordersCount={orders.length}
        quickFilters={quickFilters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        orders={orders}
      />

      {sortedOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-10 border rounded-lg bg-gray-50">
          <EmptyState
            title="No hay órdenes para mostrar"
            description="Cuando tengas pedidos, aparecerán aquí."
            action={
              <button className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                Refrescar
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
