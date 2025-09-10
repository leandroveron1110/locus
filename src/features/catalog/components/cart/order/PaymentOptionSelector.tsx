"use client";
import React from "react";
import { DollarSign, Wallet } from "lucide-react";
import { PaymentMethodType } from "@/features/orders/types/order";

interface Props {
  selectedOption: PaymentMethodType;
  onChange: (option: PaymentMethodType) => void;
  isDelivery?: boolean;
}

export default function PaymentOptionSelector({
  selectedOption,
  onChange,
  isDelivery = false,
}: Props) {
  const options = [
    {
      value: PaymentMethodType.TRANSFER,
      label: "Transferencia Bancaria",
      icon: <Wallet className="w-5 h-5 mr-3 text-gray-700" />,
    },
    {
      value: PaymentMethodType.CASH,
      label: "Efectivo",
      icon: <DollarSign className="w-5 h-5 mr-3 text-gray-700" />,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3 text-lg">
        Método de pago
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedOption === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 shadow-md text-blue-700"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gray-100"
                }
              `}
            >
              {option.icon}
              <span className="font-medium text-gray-800">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
