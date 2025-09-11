// src/components/OptionItem.tsx
"use client";
import React from "react";
import { Option } from "@/features/catalog/types/catlog";
import { CheckCircle } from "lucide-react";

interface OptionItemProps {
  option: Option;
  groupId: string;
  selected: Option[];
  max: number;
  multiple: boolean;
  toggleOption: (
    groupId: string,
    option: Option,
    max: number,
    multiple: boolean
  ) => void;
  currencyMask: string;
}

export default function OptionItem({
  option,
  groupId,
  selected,
  max,
  multiple,
  toggleOption,
  currencyMask,
}: OptionItemProps) {
  const isSelected = selected.some((opt) => opt.id === option.id);
  const reachedMax = !isSelected && selected.length >= max;
  const price = Number(option.priceFinal) || 0;

  return (
    <li
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => !reachedMax && toggleOption(groupId, option, max, multiple)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!reachedMax) toggleOption(groupId, option, max, multiple);
        }
      }}
      className={`relative border rounded-xl p-4 cursor-pointer transition-all select-none shadow-sm
        ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
        ${reachedMax ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div className="flex flex-col gap-2 pr-7"> 
        {/* Nombre de la opción */}
        <span className="font-medium text-gray-800 break-words leading-snug">
          {option.name}
        </span>

        {/* Precio alineado abajo */}
        <span
          className={`text-sm font-semibold ${
            price > 0 ? "text-green-600" : "text-gray-500"
          }`}
        >
          {price > 0
            ? `+${currencyMask} ${price.toLocaleString("es-AR")}`
            : "Incluido"}
        </span>
      </div>

      {/* Check de selección (sin romper layout) */}
      {isSelected && (
        <CheckCircle
          size={20}
          className="absolute top-3 right-3 text-blue-600 shrink-0"
        />
      )}
    </li>
  );
}
