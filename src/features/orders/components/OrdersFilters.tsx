"use client";
import React from "react";
import { OrderStatus, PaymentStatus, PaymentMethodType } from "../types/order";

type StatusFilter = OrderStatus | PaymentStatus;

interface Filter {
  label: string;
  statuses: StatusFilter[];
  condition?: (order: any) => boolean;
}

interface OrdersFiltersProps {
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
  quickFilters,
  activeFilter,
  setActiveFilter,
  orders,
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {quickFilters.map((filter) => {
        const count = orders.filter((o) =>
          filter.condition ? filter.condition(o) : filter.statuses.includes(o.status)
        ).length;

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

// En el mismo archivo o en un archivo separado, por ejemplo, `FilterButton.tsx`

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
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        transition-colors duration-200 ease-in-out
        ${active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
    >
      {label}
      <span
        className={`
          px-2 py-0.5 text-xs font-semibold rounded-full
          ${active
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-600"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}