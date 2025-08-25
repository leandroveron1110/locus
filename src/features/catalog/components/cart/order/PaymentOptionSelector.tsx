// src/components/PaymentOptionSelector.tsx
"use client";
import React from "react";
import { DollarSign, Wallet, Truck } from "lucide-react";
import { PaymentMethodType } from "@/features/orders/types/order";

interface Props {
  selectedOption: PaymentMethodType;
  onChange: (option: PaymentMethodType) => void;
  isDelivery: boolean;
}

export default function PaymentOptionSelector({
  selectedOption,
  onChange,
}: Props) {
  const options = [
    {
      value: PaymentMethodType.TRANSFER,
      label: "Transferencia Bancaria",
      icon: <Wallet className="w-4 h-4 mr-2" />,
    },
    {
      value: PaymentMethodType.CASH,
      label: "Efectivo",
      icon: <DollarSign className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold mb-3">Método de pago:</h3>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex items-center p-3 rounded-md transition-all duration-200
              ${
                selectedOption === option.value
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }
            `}
          >
            {option.icon}
            <span className="font-medium text-sm">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}