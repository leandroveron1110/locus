import React from "react";
import { BusinessPaymentMethod } from "@/features/catalog/types/business";
import { Copy, Wallet, Info } from "lucide-react";

interface Props {
  paymentMethods: BusinessPaymentMethod[];
}

export default function TransferDetails({ paymentMethods }: Props) {
  const activeMethods = paymentMethods.filter((method) => method.isActive);

  if (!activeMethods || activeMethods.length === 0) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <p className="font-semibold text-red-800">
          No hay métodos de pago por transferencia disponibles.
        </p>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 max-w-3xl mx-auto">
      {/* Título */}
      <div className="flex items-center text-blue-800 mb-5">
        <Wallet className="w-6 h-6 mr-2 text-blue-600" />
        <h3 className="font-bold text-xl text-gray-900">
          Datos para Transferencia
        </h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Selecciona el alias bancario o CBU de tu preferencia para realizar la
        transferencia. No olvides enviar el comprobante de pago.
      </p>

      {/* Lista de métodos de pago */}
      <div className="flex flex-col gap-5">
        {activeMethods.map((method) => (
          <div
            key={method.id}
            className="relative bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Botón de copiar arriba a la derecha */}
            <button
              onClick={() => handleCopy(method.alias)}
              className="absolute top-4 right-4 px-4 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors flex items-center gap-1"
              title="Copiar alias"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Información de la cuenta */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  Alias:
                </span>
                <span className="text-sm text-gray-700 break-all">
                  {method.alias}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  CBU:
                </span>
                <span className="text-sm text-gray-700 break-all">
                  {method.account}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  Titular:
                </span>
                <span className="text-sm text-gray-700">
                  {method.holderName}
                </span>
              </div>
              {method.instructions && (
                <p className="text-xs text-gray-500 italic flex items-start gap-1 mt-2">
                  <Info className="w-3 h-3 flex-shrink-0 mt-1 sm:mt-0" />
                  Por favor enviar el la captura del comprobante
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
