"use client";
import { AddressCreateDto } from "@/features/catalog/types/address";
import React from "react";

interface Props {
  addresses: AddressCreateDto[];
  selectedId: string | undefined;
  onChange: (selection: {
    id: string;
    text: string;
    lat: number;
    lng: number;
    notes: string;
  }) => void;
  onCreateNew: () => void;
}

export default function AddressSelector({
  addresses,
  selectedId,
  onChange,
  onCreateNew,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {addresses?.map((addr) => {
          const text = `${addr.street} ${addr.number}, ${addr.city}`;
          const isSelected = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              onClick={() =>
                onChange({
                  id: addr.id,
                  text,
                  lat: addr.latitude || 0,
                  lng: addr.longitude || 0,
                  notes: addr.notes || ""
                })
              }
              className={`flex items-center justify-between w-full p-4 rounded-xl border transition
                ${isSelected
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-gray-300 hover:border-blue-400 active:bg-gray-100"
                }
              `}
            >
              <span className="text-gray-800 text-sm sm:text-base truncate max-w-[80%]">
                {text}
              </span>
              {isSelected && (
                <span className="text-blue-600 font-bold text-lg">✔</span>
              )}
            </button>
          );
        })}

        {/* Botón para crear nueva dirección */}
        <button
          onClick={() => onChange({ id: "new", text: "", lat: 0, lng: 0 , notes: ""})}
          className={`flex items-center text-center justify-center w-full p-4 pt-2 pb-2 rounded-full border transition
            ${selectedId === "new"
              ? "border-blue-600 bg-blue-50 shadow-sm"
              : "border-gray-300 hover:border-blue-400 active:bg-gray-100"
            }
          `}
        >
          <span className="text-gray-800 text-center text-sm sm:text-base">
            Agregar nueva dirección
          </span>
        </button>
      </div>

      {/* Botón extra para abrir formulario si ya seleccionó "new" */}
      {selectedId === "new" && (
        <button
          onClick={onCreateNew}
          className="mt-1 text-sm text-blue-600 hover:underline self-start"
        >
          Abrir formulario de dirección
        </button>
      )}
    </div>
  );
}
