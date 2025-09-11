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
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-500 font-medium animate-pulse">
          Cargando opciones de envío...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600 font-semibold">
          Hubo un problema al cargar las compañías de delivery. Por favor,
          intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-yellow-700 font-semibold">
          No hay compañías de delivery disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 mb-2">
        Selecciona la compañía de delivery
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((company) => {
          const isSelected = selectedCompanyId === company.id;
          return (
            <button
              key={company.id}
              onClick={() => onChange(company)}
              className={`
                p-5 rounded-xl border-2 transition-all duration-200 ease-in-out
                text-left relative
                ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-indigo-400"
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-indigo-600">
                  <CircleCheck className="w-6 h-6" />
                </div>
              )}
              <div className="flex items-center space-x-3 mb-2">
                <Truck className="w-6 h-6 text-gray-500" />
                <span className="font-bold text-lg text-gray-800">
                  {company.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Phone className="w-4 h-4" />
                <span>{company.phone || "No especificado"}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}