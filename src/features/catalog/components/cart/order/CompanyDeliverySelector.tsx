"use client";

import { useCompanyDelivery } from "@/features/catalog/hooks/useCompanyDelivery";
import { CompanyDeliveryWithPrice } from "@/features/catalog/types/zone";
import React from "react";
import { Truck, Phone, CircleCheck, Tag } from "lucide-react";
import { formatPrice } from "@/features/common/utils/formatPrice";

interface Props {
  selectedCompanyId?: string;
  lat: number | undefined;
  lng: number | undefined;
  onChange: (company: CompanyDeliveryWithPrice) => void;
}

export default function CompanyDeliverySelector({
  selectedCompanyId,
  lat,
  lng,
  onChange,
}: Props) {
  const shouldFetch = !!lat && !!lng;
  const { data, isLoading, isError } = useCompanyDelivery(lat, lng);

  if (!shouldFetch) {
    return (
      <div className="p-4 sm:p-6 bg-blue-50 border border-blue-300 rounded-2xl flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-3">
        <Truck className="w-6 h-6 text-blue-600" />
        <p className="text-blue-700 font-medium text-sm sm:text-base">
          Selecciona una dirección para ver las opciones de envío.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 rounded-2xl flex items-center justify-center gap-2 animate-pulse">
        <Truck className="w-5 h-5 text-gray-400" />
        <p className="text-gray-500 font-medium text-sm sm:text-base">
          Calculando tarifas de envío para tu dirección...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
        <Truck className="w-6 h-6 text-red-600" />
        <p className="text-red-600 font-medium text-sm sm:text-base">
          Hubo un problema al cargar las opciones de envío. Intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-yellow-50 border border-yellow-300 rounded-2xl flex items-center gap-3">
        <Truck className="w-6 h-6 text-yellow-600" />
        <p className="text-yellow-700 font-medium text-sm sm:text-base">
          No hay compañías de delivery disponibles para esta dirección.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white ">

      <div className="grid grid-cols-1 gap-4">
        {data.map((company) => (
          <CompanyOption
            key={company.idCompany}
            company={company}
            isSelected={selectedCompanyId === company.idCompany}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}

interface CompanyOptionProps {
  company: CompanyDeliveryWithPrice;
  isSelected: boolean;
  onChange: (company: CompanyDeliveryWithPrice) => void;
}

const CompanyOption = ({ company, isSelected, onChange }: CompanyOptionProps) => {
  return (
    <button
      onClick={() => onChange(company)}
      role="radio"
      aria-checked={isSelected}
      className={`
        w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all duration-200
        ${
          isSelected
            ? "border-indigo-500 bg-indigo-50 shadow-md"
            : "border-gray-200 bg-white hover:border-indigo-400 hover:bg-gray-50"
        }
      `}
    >
      {/* Lado izquierdo: Nombre + Descripción */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Truck
            className={`w-5 h-5 flex-shrink-0 ${
              isSelected ? "text-indigo-600" : "text-gray-500"
            }`}
          />
          <h4 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
            {company.name}
          </h4>
        </div>

        <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-gray-500">
          <span className="truncate">
            {company.price !== null
              ? company.priceMessage
              : "Zona no cubierta o fuera de horario"}
          </span>
        </div>
      </div>

      {/* Lado derecho: Precio o Estado */}
      <div className="flex items-center gap-2 sm:ml-3 flex-shrink-0">
        {company.price !== null ? (
          <span
            className={`font-semibold text-sm sm:text-base ${
              isSelected ? "text-indigo-700" : "text-green-600"
            }`}
          >
            {formatPrice(company.price)}
          </span>
        ) : (
          <span className="text-red-600 text-xs sm:text-sm font-medium">
            {company.priceMessage?.includes("Horario")
              ? "Fuera de horario"
              : "No disponible"}
          </span>
        )}
        {isSelected && (
          <CircleCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        )}
      </div>
    </button>
  );
};
