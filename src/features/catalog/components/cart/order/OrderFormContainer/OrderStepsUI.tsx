"use client";

import React from "react";
import { CheckCircle2, Lock } from "lucide-react";
import DeliveryOptionSelector from "../DeliveryOptionSelector";
import AddressSelector from "../AddressSelector";
import CompanyDeliverySelector from "../CompanyDeliverySelector";
import SubmitOrderButton from "../SubmitOrderButton";
import OrderSummary from "./OrderSummary";

import { PaymentMethodType } from "@/features/orders/types/order";
import { DeliveryOption } from "@/features/catalog/types/order";
import {
  CompanyDeliveryWithPrice,
  PriceZone,
} from "@/features/catalog/types/zone";
import { CreateOrderFull } from "@/features/catalog/types/order";
import { AddressCreateDto } from "@/features/catalog/types/address";
import PaymentSelectorsUnified from "../PaymentSelectorsUnified";

type Step = "deliveryInfo" | "payment";
type CadetPaymentMethod = "cash" | "transfer";

interface PaymentBreakdown {
  cash: number;
  transfer: number;
  qr: number;
  delivery: number | null | undefined;
  total: number;
}

interface Props {
  paymentBreakdown: PaymentBreakdown;
  activeStep: Step;
  setActiveStep: (step: Step) => void;
  selectedDeliveryOption: DeliveryOption;
  setSelectedDeliveryOption: (option: DeliveryOption) => void;
  addresses: AddressCreateDto[];
  selectedAddress:
    | { id: string; text: string; lat: number; lng: number; notes: string }
    | undefined;
  setSelectedAddress: (
    address:
      | { id: string; text: string; lat: number; lng: number; notes: string }
      | undefined
  ) => void;
  selectedCadetPayment: CadetPaymentMethod;
  setSelectedCadetPayment: (cadetePayment: CadetPaymentMethod)=> void;
  handleAddressChange: (selection: {
    id: string;
    text: string;
    lat: number;
    lng: number;
    notes: string;
  }) => void;
  selectedCompanyDelivery: CompanyDeliveryWithPrice | null;
  setSelectedCompanyDelivery: (
    company: CompanyDeliveryWithPrice | null
  ) => void;
  selectedPaymentOption: PaymentMethodType;
  setSelectedPaymentOption: (option: PaymentMethodType) => void;
  orderPayload: CreateOrderFull | null;
  canCreateOrder: boolean;
  priceZone: PriceZone | undefined;
  orderNote: string;
  lat: number | undefined;
  lng: number | undefined;
  setOrderNote: (note: string) => void;
}

export default function OrderStepsUI({
  activeStep,
  setActiveStep,
  selectedDeliveryOption,
  setSelectedDeliveryOption,
  addresses,
  selectedAddress,
  setSelectedAddress,
  setSelectedCadetPayment,
  selectedCadetPayment,
  handleAddressChange,
  selectedCompanyDelivery,
  setSelectedCompanyDelivery,
  selectedPaymentOption,
  setSelectedPaymentOption,
  orderPayload,
  canCreateOrder,
  priceZone,
  orderNote,
  setOrderNote,
  lat,
  lng,
  paymentBreakdown
}: Props) {
  const steps: {
    key: Step;
    title: string;
    content: React.ReactNode;
    isEnabled: boolean;
  }[] = [
    // Paso unificado: Entrega (incluye dirección y cadetería si corresponde)
    {
      key: "deliveryInfo",
      title: "1. Detalles de entrega",
      content: (
        <>
          <DeliveryOptionSelector
            selectedOption={selectedDeliveryOption}
            onChange={(option) => {
              setSelectedDeliveryOption(option);
              if (option === "DELIVERY") {
                setActiveStep("deliveryInfo");
              } else {
                // Si elige retiro, limpiamos datos previos
                setSelectedAddress(undefined);
                setSelectedCompanyDelivery(null);
              }
            }}
          />

          {selectedDeliveryOption === "DELIVERY" && (
            <div className="mt-3 space-y-4">
              <AddressSelector
                addresses={addresses || []}
                selectedId={selectedAddress?.id}
                onChange={handleAddressChange}
                onCreateNew={() => {}}
              />

              {selectedAddress && (
                <CompanyDeliverySelector
                  lat={lat}
                  lng={lng}
                  selectedCompanyId={selectedCompanyDelivery?.idCompany}
                  onChange={(company) => {
                    setSelectedCompanyDelivery(company);
                  }}
                />
              )}
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => setActiveStep("payment")}
              disabled={
                selectedDeliveryOption === "DELIVERY" &&
                (!selectedAddress || !selectedCompanyDelivery)
              }
              className={`w-full text-sm font-medium py-2 rounded-lg transition-colors ${
                selectedDeliveryOption === "DELIVERY" &&
                (!selectedAddress || !selectedCompanyDelivery)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Continuar
            </button>
          </div>
        </>
      ),
      isEnabled: true,
    },

    // Paso 2: Pago y resumen final
    {
      key: "payment",
      title: "2. Selecciona el método de pago",
      content: (
        <>
          {/* <PaymentOptionSelector
            selectedOption={selectedPaymentOption}
            onChange={setSelectedPaymentOption}
            isDelivery={selectedDeliveryOption === "DELIVERY"}
          />

          {selectedDeliveryOption === "DELIVERY" && (
            <div className="mt-3">
              <CadetPaymentSelector selectedOption={"cash"} onChange={() => {}} />
            </div>
          )} */}
          <PaymentSelectorsUnified
            selectedOrderPayment={selectedPaymentOption}
            setSelectedOrderPayment={setSelectedPaymentOption}
            selectedCadetPayment={selectedCadetPayment}
            setSelectedCadetPayment={setSelectedCadetPayment}
            isDelivery={selectedDeliveryOption === "DELIVERY"}
          />

          <OrderSummary
            isDelivery={true}
            priceZoneMessage={priceZone?.message}
            orderNote={orderNote}
            setOrderNote={setOrderNote}
            paymentBreakdown={paymentBreakdown}
          />

          {canCreateOrder && orderPayload && (
            <div className="mt-4">
              <SubmitOrderButton orderPayload={orderPayload} />
            </div>
          )}
        </>
      ),
      isEnabled: true,
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {steps.map(({ key, title, content, isEnabled }) => {
        const isActive = activeStep === key;
        const isDone =
          key === "deliveryInfo"
            ? selectedDeliveryOption !== undefined &&
              (selectedDeliveryOption === "PICKUP" ||
                (selectedAddress && selectedCompanyDelivery))
            : key === "payment"
            ? canCreateOrder
            : false;

        return (
          <div
            key={key}
            className={`p-3 sm:p-4 rounded-xl shadow-sm border transition-all ${
              isActive
                ? "bg-white border-indigo-500"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div
              className={`flex items-center justify-between ${
                isEnabled ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => isEnabled && setActiveStep(key)}
            >
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-800">
                {isDone && <CheckCircle2 className="text-green-500 w-4 h-4" />}
                {!isEnabled && <Lock className="text-gray-400 w-4 h-4" />}
                {title}
              </h2>
            </div>

            {isActive && isEnabled && (
              <div className="mt-2 sm:mt-3">{content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
