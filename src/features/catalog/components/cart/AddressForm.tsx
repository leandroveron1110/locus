"use client";
import React from "react";

interface Address {
  street?: string;
  number?: string;
}

interface Props {
  address: Partial<Address>;
  onChange: (data: Partial<Address>) => void;
  onSave: () => void;
}

export default function AddressForm({ address, onChange, onSave }: Props) {
  return (
    <div className="border rounded p-4 bg-gray-50 space-y-3">
      <h3 className="font-semibold text-gray-800">Nueva dirección</h3>
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="Calle"
          value={address.street || ""}
          onChange={(e) => onChange({ ...address, street: e.target.value })}
          className="border rounded px-2 py-1"
        />
        <input
          placeholder="Número"
          value={address.number || ""}
          onChange={(e) => onChange({ ...address, number: e.target.value })}
          className="border rounded px-2 py-1"
        />
      </div>
      <button
        onClick={onSave}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Guardar dirección
      </button>
    </div>
  );
}
