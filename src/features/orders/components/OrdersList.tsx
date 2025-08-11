"use client";
import React from "react";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../types/order";
import OrderCard from "./OrderCard";

interface OrdersListProps {
  userId: string;
}

export default function OrdersList({ userId }: OrdersListProps) {
  const orders: Order[] = useOrders(userId);

  return (
    <div className="space-y-6">
      {orders.length === 0 && (
        <p className="text-center text-gray-500">
          No hay órdenes para mostrar.
        </p>
      )}

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
