"use client";
import React from "react";
import { Address, AddressCreateDto } from "../../types/address";

interface Props {
  addresses: AddressCreateDto[];
  selectedId: string | null;
  onChange: (id: string) => void;
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
        onChange={(e) => onChange(e.target.value)}
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
