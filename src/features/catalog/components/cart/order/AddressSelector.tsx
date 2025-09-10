"use client";
import { AddressCreateDto } from "@/features/catalog/types/address";
import React from "react";

interface Props {
  addresses: AddressCreateDto[];
  selectedId: string | undefined;
  onChange: (selection: { id: string; text: string }) => void;
  onCreateNew: () => void;
}

export default function AddressSelector({
  addresses,
  selectedId,
  onChange,
  onCreateNew,
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block font-semibold text-gray-700 mb-2">
        📍 Dirección de entrega
      </label>

      <div className="grid grid-cols-1 gap-2">
        {addresses?.map((addr) => {
          const text = `${addr.street} ${addr.number}, ${addr.city}`;
          const isSelected = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              onClick={() => onChange({ id: addr.id, text })}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition
                ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
              `}
            >
              <span className="text-gray-800">{text}</span>
              {isSelected && (
                <span className="text-blue-600 font-semibold">✔</span>
              )}
            </button>
          );
        })}

        {/* Botón para crear nueva dirección */}
        <button
          onClick={() => onChange({ id: "new", text: "" })}
          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition
            ${selectedId === "new" ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
          `}
        >
          <span className="text-gray-800">+ Agregar nueva dirección</span>
        </button>
      </div>

      {/* Botón extra para abrir formulario si ya seleccionó "new" */}
      {selectedId === "new" && (
        <button
          onClick={onCreateNew}
          className="mt-1 text-sm text-blue-600 hover:underline"
        >
          Abrir formulario de dirección
        </button>
      )}
    </div>
  );
}
