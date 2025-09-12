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

  const handleToggle = () => {
    if (!reachedMax) {
      toggleOption(groupId, option, max, multiple);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  const formattedPrice = price > 0
    ? `+${currencyMask} ${price.toLocaleString("es-AR")}`
    : "Incluido";

  return (
    <li
      role={multiple ? "option" : "radio"} // ⬅️ Mejoramos el rol de accesibilidad
      aria-checked={isSelected}
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={`
        relative border rounded-xl p-4 cursor-pointer transition-all select-none shadow-sm
        ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
        ${reachedMax ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div className="flex items-start justify-between"> {/* ⬅️ Usamos flexbox para alinear */}
        <div className="flex flex-col gap-2 pr-2 overflow-hidden">
          {/* Nombre de la opción */}
          <span className="font-medium text-gray-800 break-words leading-snug">
            {option.name}
          </span>
          {/* Precio */}
          <span className={`text-sm font-semibold ${price > 0 ? "text-green-600" : "text-gray-500"}`}>
            {formattedPrice}
          </span>
        </div>

        {/* Check de selección */}
        {isSelected && (
          <CheckCircle
            size={20}
            className="text-blue-600 flex-shrink-0"
          />
        )}
      </div>
    </li>
  );
}