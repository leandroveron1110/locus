"use client";
import React from "react";
import { DollarSign, Wallet, TruckElectric } from "lucide-react";

export type CadetPaymentMethod = "cash" | "transfer";

interface Props {
  selectedOption: CadetPaymentMethod;
  onChange: (option: CadetPaymentMethod) => void;
}

// Componente auxiliar para el círculo de selección (radio)
const RadioIndicator = ({ isSelected }: { isSelected: boolean }) => (
  <div
    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 flex-shrink-0 ${
      isSelected ? "border-blue-600 bg-white" : "border-gray-300 bg-gray-100"
    }`}
  >
    {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
  </div>
);

export default function CadetPaymentSelector({
  selectedOption,
  onChange,
}: Props) {
  const options = [
    {
      value: "cash" as CadetPaymentMethod,
      label: "Efectivo",
      description: "Pagás al cadete al recibir el pedido.",
      icon: DollarSign,
    },
    {
      value: "transfer" as CadetPaymentMethod,
      label: "Transferencia",
      description: "Hacés una transferencia al cadete en el momento.",
      icon: Wallet,
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl mt-5 border border-gray-100 shadow-lg">
      <h3 className="font-bold text-gray-900 mb-4 text-lg sm:text-xl flex items-center gap-2">
        <TruckElectric className="w-6 h-6 text-gray-600" />
        Pago del Envío
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {options.map(({ value, label, description, icon: Icon }) => {
          const isSelected = selectedOption === value;
          return (
            <button
              key={value}
              onClick={() => onChange(value)}
              className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-left transition-all duration-300 w-full cursor-pointer
                ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 shadow-md transform scale-[1.01]"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50/50"
                }
              `}
            >
              {/* Contenedor principal: Icono, Título y Descripción (Responsive: Columna en móvil, Fila en desktop) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                {/* Contenedor del Icono y Título */}
                <div className="flex items-center gap-3">
                  {/* Icono */}
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${
                      isSelected
                        ? "bg-blue-600/10 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Título (Label) */}
                  <span
                    className={`font-semibold text-base transition-colors ${
                      isSelected ? "text-blue-800" : "text-gray-800"
                    }`}
                  >
                    {label}
                  </span>
                </div>

                {/* Descripción */}
                <p
                  className={`text-sm transition-colors mt-1 sm:mt-0 sm:ml-4 flex-shrink min-w-0 ${
                    isSelected ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {description}
                </p>
              </div>

              {/* Indicador de Radio a la derecha */}
              <div className="self-center flex-shrink-0">
                <RadioIndicator isSelected={isSelected} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Información detallada de la selección */}
      {selectedOption === "cash" && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-inner">
          <div className="flex items-start gap-2">
            <p className="flex-1">
              <strong>Efectivo:</strong> Recuerda tener el monto exacto. Pagarás
              el envío al cadete al momento de la entrega.
            </p>
          </div>
        </div>
      )}

      {selectedOption === "transfer" && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 shadow-inner">
          <div className="flex items-start gap-2">
            <p className="flex-1">
              <strong>Transferencia:</strong> Podrás realizar la transferencia
              al cadete una vez que te haya entregado el pedido.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
