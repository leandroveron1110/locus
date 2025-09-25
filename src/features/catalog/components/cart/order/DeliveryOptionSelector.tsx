// components/DeliveryOptionSelector.tsx

import { DeliveryOption } from "@/features/catalog/types/order";
import React from "react";
import { Store, Truck } from "lucide-react";

interface Props {
  selectedOption: DeliveryOption;
  onChange: (option: DeliveryOption) => void;
}

export default function DeliveryOptionSelector({
  selectedOption,
  onChange,
}: Props) {
  return (
    <div className="bg-white mt-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => onChange("PICKUP")}
          className={`flex items-center justify-center gap-2 flex-1 p-4 rounded-xl font-semibold transition-all duration-200 min-h-[48px]
            ${
              selectedOption === "PICKUP"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300"
            } active:scale-95`}
        >
          <Store className="w-5 h-5" />
          <span className="text-sm sm:text-base">Retiro en el local</span>
        </button>

        <button
          onClick={() => onChange("DELIVERY")}
          className={`flex items-center justify-center gap-2 flex-1 p-4 rounded-xl font-semibold transition-all duration-200 min-h-[48px]
            ${
              selectedOption === "DELIVERY"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300"
            } active:scale-95`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-sm sm:text-base">Envío a domicilio</span>
        </button>
      </div>
    </div>
  );
}
