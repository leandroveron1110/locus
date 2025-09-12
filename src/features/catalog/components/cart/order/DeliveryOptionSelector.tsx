// components/DeliveryOptionSelector.tsx

import { DeliveryOption } from "@/features/catalog/types/order";
import React from "react";

interface Props {
  selectedOption: DeliveryOption;
  onChange: (option: DeliveryOption) => void;
}

export default function DeliveryOptionSelector({
  selectedOption,
  onChange,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">
        ¿Cómo quieres recibir tu pedido?
      </h3>
      <div className="flex gap-4">
        <button
          onClick={() => onChange("PICKUP")}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            selectedOption === "PICKUP"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Retiro en el local
        </button>
        <button
          onClick={() => onChange("DELIVERY")}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            selectedOption === "DELIVERY"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Envío a domicilio
        </button>
      </div>
    </div>
  );
}