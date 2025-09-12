// OrdersList.tsx
"use client";
import React, { useState, useMemo } from "react";
import { useOrders } from "../hooks/useOrders";
import { Order } from "../types/order";
import OrderCard from "./OrderCard/OrderCard";
import OrdersFilters from "./OrdersFilters";
import EmptyState from "./EmptyState";
import { simplifiedFilters, statusPriority } from "../utils/filtersData";

interface OrdersListProps {
  userId: string;
}

export default function OrdersList({ userId }: OrdersListProps) {
  const orders = useOrders(userId);
  const [activeFilter, setActiveFilter] = useState<string>("Todos");

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];

    const currentFilter = simplifiedFilters.find(f => f.label === activeFilter);
    
    let filtered = orders;
    if (currentFilter && currentFilter.label !== "Todos") {
      filtered = orders.filter(order => {
        if (currentFilter.condition) {
          return currentFilter.condition(order);
        }
        return currentFilter.statuses.includes(order.status);
      });
    }

    return [...filtered].sort((a, b) => {
      const priorityA = statusPriority[a.status] ?? Infinity;
      const priorityB = statusPriority[b.status] ?? Infinity;
      
      const priorityDiff = priorityA - priorityB;
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, activeFilter]);

  return (
    <div className="relative">
      {/* Contenedor de filtros con `sticky` */}
      <div 
        className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm pt-4 pb-2"
      >
        <OrdersFilters
          quickFilters={simplifiedFilters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          orders={orders as Order[]}
        />
      </div>

      <div className="sm:px-6">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-10 border border-gray-200 rounded-lg bg-gray-50 mt-6">
            <EmptyState
              title="No hay órdenes para este filtro"
              description="Intenta seleccionar otro filtro o vuelve a intentar más tarde."
              action={
                <button
                  onClick={() => setActiveFilter("Todos")}
                  className="mt-4 px-6 py-2 rounded-full font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Ver todos
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredAndSortedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}