// src/components/AddressModal.tsx

import React from "react";
import { X } from "lucide-react";
import MapClientWrapper from "@/features/locationSelector/components/MapClientWrapper";
import { AddressData } from "@/features/locationSelector/types/address-data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveAddress: (address: AddressData) => Promise<void>;
}

export default function AddressModal({ isOpen, onClose, onSaveAddress }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg mx-4 rounded-3xl overflow-hidden relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <MapClientWrapper saveAddress={onSaveAddress} />
      </div>
    </div>
  );
}