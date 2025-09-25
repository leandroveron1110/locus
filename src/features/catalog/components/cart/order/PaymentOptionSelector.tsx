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
}: Props) {
  const options = [
    {
      value: PaymentMethodType.TRANSFER,
      label: "Transferencia Bancaria",
      icon: Wallet,
    },
    {
      value: PaymentMethodType.CASH,
      label: "Efectivo",
      icon: DollarSign,
    },
  ];

  return (
    <div className="bg-white pt-4 rounded-xl  border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3 text-base sm:text-lg">
        Método de pago
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(({ value, label, icon: Icon }) => {
          const isSelected = selectedOption === value;
          return (
            <button
              key={value}
              onClick={() => onChange(value)}
              className={`flex items-center p-3 rounded-xl border transition-all duration-200 gap-3
                ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gray-100"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${
                  isSelected ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="text-sm sm:text-base font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
