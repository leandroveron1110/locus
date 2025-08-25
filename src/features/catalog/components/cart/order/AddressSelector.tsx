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
    <div className="space-y-2">
      <label className="block font-semibold">📍 Dirección de entrega</label>
      <select
        className="border rounded px-2 py-1 w-full"
        value={selectedId || ""}
        onChange={(e) => {
          const id = e.target.value;
          if (id === "new") {
            onChange({ id, text: "" });
          } else {
            const addr = addresses.find((a) => a.id === id);
            if (addr) {
              const text = `${addr.street} ${addr.number}, ${addr.city}`;
              onChange({ id, text });
            }
          }
        }}
      >
        <option value="">-- Selecciona una dirección --</option>
        {addresses.map((addr) => (
          <option key={addr.id} value={addr.id}>
            {addr.street} {addr.number}, {addr.city}
          </option>
        ))}
        <option value="new">+ Crear nueva dirección</option>
      </select>

      {selectedId === "new" && (
        <button
          onClick={onCreateNew}
          className="text-sm text-blue-600 hover:underline"
        >
          Crear nueva dirección
        </button>
      )}
    </div>
  );
}
