import React from "react";
import { CheckCircle2, Lock } from "lucide-react";
import DeliveryOptionSelector from "../DeliveryOptionSelector";
import AddressSelector from "../AddressSelector";
import CompanyDeliverySelector from "../CompanyDeliverySelector";
import PaymentOptionSelector from "../PaymentOptionSelector";
import SubmitOrderButton from "../SubmitOrderButton";
import OrderSummary from "./OrderSummary";
import { PaymentMethodType } from "@/features/orders/types/order";
import { DeliveryOption } from "@/features/catalog/types/order";
import { CompanyDelivery } from "@/features/catalog/types/zone";
import { CreateOrderFull } from "@/features/catalog/types/order";
import { PriceZone } from "@/features/catalog/types/zone";
import { AddressCreateDto } from "@/features/catalog/types/address";

type Step = "delivery" | "address" | "deliveryCompany" | "payment";

interface Props {
  activeStep: Step;
  setActiveStep: (step: Step) => void;
  selectedDeliveryOption: DeliveryOption;
  setSelectedDeliveryOption: (option: DeliveryOption) => void;
  addresses: AddressCreateDto[];
  selectedAddress: { id: string; text: string; lat: number; lng: number } | undefined;
  setSelectedAddress: (address: { id: string; text: string; lat: number; lng: number } | undefined) => void;
  handleAddressChange: (selection: { id: string; text: string; lat: number; lng: number }) => void;
  selectedCompanyDelivery: CompanyDelivery | null;
  setSelectedCompanyDelivery: (company: CompanyDelivery | null) => void;
  selectedPaymentOption: PaymentMethodType;
  setSelectedPaymentOption: (option: PaymentMethodType) => void;
  orderPayload: CreateOrderFull | null;
  canCreateOrder: boolean;
  isPriceLoading: boolean;
  priceZone: PriceZone | undefined;
  orderNote: string;
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
  handleAddressChange,
  selectedCompanyDelivery,
  setSelectedCompanyDelivery,
  selectedPaymentOption,
  setSelectedPaymentOption,
  orderPayload,
  canCreateOrder,
  isPriceLoading,
  priceZone,
  orderNote,
  setOrderNote,
}: Props) {
  const steps: { key: Step; title: string; content: React.ReactNode; isEnabled: boolean }[] = [
    {
      key: "delivery",
      title: "1. Elige tu opción de entrega",
      content: (
        <DeliveryOptionSelector
          selectedOption={selectedDeliveryOption}
          onChange={(option) => {
            setSelectedDeliveryOption(option);
            if (option === "DELIVERY") {
              setActiveStep("address");
            } else {
              setSelectedAddress(undefined);
              setSelectedCompanyDelivery(null);
              setActiveStep("payment");
            }
          }}
        />
      ),
      isEnabled: true,
    },
    {
      key: "address",
      title: "2. Selecciona tu dirección",
      content: (
        <AddressSelector
          addresses={addresses || []}
          selectedId={selectedAddress?.id}
          onChange={handleAddressChange}
          onCreateNew={() => {}}
        />
      ),
      isEnabled: selectedDeliveryOption === "DELIVERY",
    },
    {
      key: "deliveryCompany",
      title: "3. Elige la cadetería",
      content: (
        <>
          <CompanyDeliverySelector
            selectedCompanyId={selectedCompanyDelivery?.id}
            onChange={(company) => setSelectedCompanyDelivery(company)}
          />
          {selectedCompanyDelivery && (
            <button
              onClick={() => setActiveStep("payment")}
              className="mt-3 w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continuar
            </button>
          )}
        </>
      ),
      isEnabled: selectedDeliveryOption === "DELIVERY" && selectedAddress !== undefined,
    },
    {
      key: "payment",
      title: "4. Selecciona el método de pago",
      content: (
        <>
          <PaymentOptionSelector
            selectedOption={selectedPaymentOption}
            onChange={setSelectedPaymentOption}
            isDelivery={selectedDeliveryOption === "DELIVERY"}
          />
          <OrderSummary
            subtotal={orderPayload?.total ?? 0}
            deliveryPrice={priceZone?.price ?? undefined}
            isPriceLoading={isPriceLoading}
            isDelivery={selectedDeliveryOption === "DELIVERY"}
            priceZoneMessage={priceZone?.message}
            orderNote={orderNote}
            setOrderNote={setOrderNote}
          />
          {canCreateOrder && orderPayload && (
            <div className="mt-4">
              <SubmitOrderButton orderPayload={orderPayload} />
            </div>
          )}
        </>
      ),
      isEnabled:
        selectedDeliveryOption === "PICKUP" ||
        (selectedDeliveryOption === "DELIVERY" && selectedCompanyDelivery !== null),
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {steps
        .filter((s) =>
          selectedDeliveryOption === "PICKUP"
            ? s.key !== "address" && s.key !== "deliveryCompany"
            : true
        )
        .map(({ key, title, content, isEnabled }) => {
          const isActive = activeStep === key;
          const isDone =
            key === "delivery"
              ? selectedDeliveryOption !== undefined
              : key === "address"
              ? selectedAddress !== undefined
              : key === "deliveryCompany"
              ? selectedCompanyDelivery !== null
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
                <div className="">{content}</div>
              )}
            </div>
          );
        })}
    </div>
  );
}
