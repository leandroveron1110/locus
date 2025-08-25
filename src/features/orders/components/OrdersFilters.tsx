// OrdersFilters.tsx
"use client";
import React from "react";
import { OrderStatus, PaymentStatus, PaymentMethodType } from "../types/order";

type StatusFilter = OrderStatus | PaymentStatus;

interface Filter {
  label: string;
  statuses: StatusFilter[];
}

interface OrdersFiltersProps {
  ordersCount: number;
  quickFilters: Filter[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  orders: {
    status: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentType?: PaymentMethodType;
  }[];
}

export default function OrdersFilters({
  ordersCount,
  quickFilters,
  activeFilter,
  setActiveFilter,
  orders,
}: OrdersFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {quickFilters.map((filter) => {
        const count = orders.filter((o) => {
          const matchStatus = filter.statuses.includes(o.status);
          if (filter.label === "Pago pendiente") {
            return (
              matchStatus &&
              o.paymentType === PaymentMethodType.TRANSFER &&
              (o.paymentStatus === PaymentStatus.PENDING ||
                o.paymentStatus === PaymentStatus.IN_PROGRESS)
            );
          }
          return matchStatus;
        }).length;

        return (
          <FilterButton
            key={filter.label}
            label={filter.label}
            count={count}
            active={activeFilter === filter.label}
            onClick={() => setActiveFilter(filter.label)}
          />
        );
      })}
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, count, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all
        ${active
          ? "bg-blue-600 text-white border-blue-700 shadow-md scale-105"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:shadow"
        }`}
    >
      {label}
      <span
        className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
          active
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-700 border border-gray-300"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
