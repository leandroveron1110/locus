"use client";
import React from "react";
import { Wallet, DollarSign, Truck } from "lucide-react";
import { PaymentMethodType } from "@/features/orders/types/order";

type CadetPaymentMethod = "cash" | "transfer";

interface Props {
  selectedOrderPayment: PaymentMethodType;
  setSelectedOrderPayment: (option: PaymentMethodType) => void;
  selectedCadetPayment: CadetPaymentMethod;
  setSelectedCadetPayment: (option: CadetPaymentMethod) => void;
  isDelivery?: boolean;
}

/** 🔹 Indicador circular de selección */
const RadioIndicator = ({ isSelected }: { isSelected: boolean }) => (
  <div
    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
      isSelected ? "border-indigo-600 bg-white" : "border-gray-300 bg-gray-100"
    }`}
  >
    {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
  </div>
);

export default function PaymentSelectorsUnified({
  selectedOrderPayment,
  setSelectedOrderPayment,
  selectedCadetPayment,
  setSelectedCadetPayment,
  isDelivery,
}: Props) {
  const [payAllTogether, setPayAllTogether] = React.useState(false);

  const orderOptions = [
    {
      value: PaymentMethodType.TRANSFER,
      label: "Transferencia bancaria",
      description:
        "Pagás tu pedido por transferencia antes de que el local lo confirme.",
      icon: Wallet,
    },
    {
      value: PaymentMethodType.CASH,
      label: "Efectivo al recibir",
      description: "Pagás el total de tu pedido cuando lo recibas.",
      icon: DollarSign,
    },
  ];

  const cadetOptions = [
    {
      value: "cash" as CadetPaymentMethod,
      label: "Efectivo al cadete",
      description: "Pagás el envío en efectivo cuando el pedido llegue.",
      icon: DollarSign,
    },
    {
      value: "transfer" as CadetPaymentMethod,
      label: "Transferencia al cadete",
      description:
        "Transferís el costo del envío (y en algunos casos el pedido) al cadete al momento de recibirlo.",
      icon: Wallet,
    },
  ];

  return (
    <div className="bg-white mt-5 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-md">
      <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2 mb-4">
        Formas de pago
      </h3>

      {/* 🔹 Pago del pedido */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-600 mb-3">
          Pago de la orden
        </p>
        {orderOptions.map(({ value, label, description, icon: Icon }) => {
          const isSelected = selectedOrderPayment === value;
          return (
            <button
              key={value}
              onClick={() => setSelectedOrderPayment(value)}
              className={`flex items-center justify-between gap-3 w-full p-3 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/80 shadow-sm"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm ${
                      isSelected ? "text-indigo-700" : "text-gray-800"
                    }`}
                  >
                    {label}
                  </p>
                  <p
                    className={`text-xs ${
                      isSelected ? "text-indigo-600" : "text-gray-500"
                    }`}
                  >
                    {description}
                  </p>
                </div>
              </div>
              <RadioIndicator isSelected={isSelected} />
            </button>
          );
        })}
      </div>

      {/* 🔹 Opción de pagar todo junto */}
      {isDelivery && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={payAllTogether}
              onChange={() => setPayAllTogether(!payAllTogether)}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="text-sm text-gray-700 font-medium">
              Quiero pagar todo junto (pedido + envío)
            </span>
          </label>
          {payAllTogether && (
            <p className="text-xs text-gray-500 mt-1 ml-6">
              {selectedOrderPayment === PaymentMethodType.TRANSFER
                ? "Vas a transferir el total (pedido + envío) al local. El local coordinará el pago al cadete."
                : "Vas a pagar el total (pedido + envío) en efectivo al cadete, quien entregará al local el monto correspondiente al pedido."}
            </p>
          )}
        </div>
      )}

      {/* 🔹 Pago del envío (solo si es delivery y no paga todo junto) */}
      {isDelivery && !payAllTogether && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <Truck className="w-4 h-4 text-indigo-600" />
            Pago del envío
          </p>

          {cadetOptions.map(({ value, label, description, icon: Icon }) => {
            const isSelected = selectedCadetPayment === value;
            return (
              <button
                key={value}
                onClick={() => setSelectedCadetPayment(value)}
                className={`flex items-center justify-between gap-3 w-full p-3 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/80 shadow-sm"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-sm ${
                        isSelected ? "text-indigo-700" : "text-gray-800"
                      }`}
                    >
                      {label}
                    </p>
                    <p
                      className={`text-xs ${
                        isSelected ? "text-indigo-600" : "text-gray-500"
                      }`}
                    >
                      {description}
                    </p>
                  </div>
                </div>
                <RadioIndicator isSelected={isSelected} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
