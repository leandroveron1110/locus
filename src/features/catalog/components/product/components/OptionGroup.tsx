// src/components/OptionGroup.tsx
"use client";
import React, { useState } from "react";
import { Option } from "@/features/catalog/types/catlog";
import OptionItem from "./OptionItem";
import { ChevronDown } from "lucide-react";

interface OptionGroupProps {
  group: {
    id: string;
    name: string;
    maxQuantity?: number;
    options: Option[];
  };
  selected: Option[];
  toggleOption: (
    groupId: string,
    option: Option,
    max: number,
    multiple: boolean
  ) => void;
  currencyMask: string;
}

export default function OptionGroup({
  group,
  selected,
  toggleOption,
  currencyMask,
}: OptionGroupProps) {
  const max = group.maxQuantity || 1;
  const multiple = max > 1;
  const [open, setOpen] = useState(false);

  const selectedCount = selected.length;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm mb-5">
      {/* Header del grupo */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              Seleccioná {multiple ? `hasta ${max}` : "una opción"}
            </p>
            {!open && (
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {selectedCount > 0
                  ? `${selectedCount} seleccionada${
                      selectedCount > 1 ? "s" : ""
                    }`
                  : "Ninguna seleccionada"}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Lista de opciones (colapsable con transición) */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-5 pb-4">
          {group.options.map((option) => (
            <OptionItem
              key={option.id}
              option={option}
              groupId={group.id}
              selected={selected}
              max={max}
              multiple={multiple}
              toggleOption={toggleOption}
              currencyMask={currencyMask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
