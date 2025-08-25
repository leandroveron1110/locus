// src/components/TransferDetails.tsx
import React from 'react';
import { BusinessPaymentMethod } from "@/features/catalog/types/business";
import { Copy, Wallet, Info } from 'lucide-react';

interface Props {
  paymentMethods: BusinessPaymentMethod[];
}

export default function TransferDetails({ paymentMethods }: Props) {
  // Filtramos para obtener solo los métodos de pago activos
  const activeMethods = paymentMethods.filter(method => method.isActive);

  if (!activeMethods || activeMethods.length === 0) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <p className="font-semibold text-red-800">
          No hay métodos de pago por transferencia disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
      <div className="flex items-center text-blue-800 mb-3">
        <Wallet className="w-5 h-5 mr-2" />
        <h3 className="font-bold">Datos para Transferencia</h3>
      </div>
      <p className="text-sm text-blue-700 mb-3">
        Selecciona el alias bancario de tu preferencia para realizar la transferencia. No olvides enviar el comprobante de pago.
      </p>
      {activeMethods.map((method) => (
        <div key={method.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-2 last:mb-0">
          <div className="flex justify-between items-center mb-1">
            <button
              onClick={() => navigator.clipboard.writeText(`${method.alias}\n${method.account}`)}
              className="text-gray-500 hover:text-blue-500 transition-colors"
              title="Copiar cuenta"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
            <p className="text-xs text-gray-600 mb-2">Alias: {method.alias}</p>
          <p className="text-xs text-gray-600 mb-2">Cuenta: {method.account}</p>
          <p className="text-xs text-gray-600">Titular: {method.holderName}</p>
          {method.instructions && (
            <p className="text-xs text-gray-500 italic mt-2">
              <Info className="inline w-3 h-3 mr-1" />
              {method.instructions}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}