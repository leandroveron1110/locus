"use client";
import React from "react";
import { OrderItem as OrderItemType } from "../types/order";

interface Props {
  item: OrderItemType;
}

export default function OrderItem({ item }: Props) {
  return (
    <div>
      <div className="font-medium">
        {item.productName} × {item.quantity}
      </div>
      {item.optionGroups.length > 0 && (
        <div className="ml-4 mt-1 text-xs text-gray-500 space-y-1">
          {item.optionGroups.map((group) => (
            <div key={group.id}>
              <strong>{group.groupName}:</strong>{" "}
              {group.options
                .map((opt) => `${opt.optionName} × ${opt.quantity}`)
                .join(", ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
