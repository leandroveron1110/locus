"use client";

import { useCompanyDelivery } from "@/features/catalog/hooks/useCompanyDelivery";
import { CompanyDelivery } from "@/features/catalog/types/zone";
import React from "react";
import { Truck, Phone, CircleCheck } from "lucide-react";

interface Props {
  selectedCompanyId?: string;
  onChange: (company: CompanyDelivery) => void;
}

export default function CompanyDeliverySelector({
  selectedCompanyId,
  onChange,
}: Props) {
  const { data, isLoading, isError } = useCompanyDelivery();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 rounded-lg text-center" role="status">
        <p className="text-gray-500 font-medium animate-pulse text-sm sm:text-base">
          Cargando opciones de envío...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg text-center" role="alert">
        <p className="text-red-600 font-semibold text-sm sm:text-base">
          Hubo un problema al cargar las compañías de delivery. Por favor,
          intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center" role="alert">
        <p className="text-yellow-700 font-semibold text-sm sm:text-base">
          No hay compañías de delivery disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 text-base sm:text-lg mb-2">
        Selecciona la compañía de delivery
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4" role="radiogroup" aria-label="Compañías de delivery disponibles">
        {data.map((company) => (
          <CompanyOption
            key={company.id}
            company={company}
            isSelected={selectedCompanyId === company.id}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}

interface CompanyOptionProps {
  company: CompanyDelivery;
  isSelected: boolean;
  onChange: (company: CompanyDelivery) => void;
}

const CompanyOption = ({ company, isSelected, onChange }: CompanyOptionProps) => {
  return (
    <button
      role="radio"
      aria-checked={isSelected}
      onClick={() => onChange(company)}
      className={`
        p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 ease-in-out
        text-left relative flex flex-col gap-1 sm:gap-2
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105"
            : "border-gray-200 bg-white hover:border-blue-300"
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 text-blue-500">
          <CircleCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
        <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
        <span className="font-bold text-base sm:text-lg text-gray-800">
          {company.name}
        </span>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>{company.phone || "No especificado"}</span>
      </div>
    </button>
  );
};