"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2 } from "lucide-react";

// 🟢 Stores & Hooks
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/catalog/stores/useCartStore";
import { useAddress, useAddresses } from "../../../hooks/useAddress";
import { usePriceZone } from "@/features/catalog/hooks/usePriceZone";

// 🟢 Tipos
import { PaymentMethodType } from "@/features/orders/types/order";
import { CompanyDelivery } from "@/features/catalog/types/zone";
import { AddressData } from "@/features/locationSelector/types/address-data";

// 🟢 Componentes UI
import DeliveryOptionSelector from "./DeliveryOptionSelector";
import AddressSelector from "./AddressSelector";
import PaymentOptionSelector from "./PaymentOptionSelector";
import SubmitOrderButton from "./SubmitOrderButton";
import MapClientWrapper from "@/features/locationSelector/components/MapClientWrapper";
import CompanyDeliverySelector from "./CompanyDeliverySelector";

type DeliveryOption = "pickup" | "delivery";
type Step = "delivery" | "address" | "deliveryCompany" | "payment";

interface Props {
  userId?: string;
  businessId: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
}

export default function OrderForm({
  userId,
  businessId,
  businessName,
  businessPhone,
  businessAddress,
}: Props) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { getTotal } = useCartStore();

  // 📦 API hooks
  const createAddress = useAddress();
  const { data: addresses, refetch: refetchAddresses } = useAddresses(userId);

  // 🟢 Estados principales
  const [activeStep, setActiveStep] = useState<Step>("delivery");
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<DeliveryOption>("delivery");
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<PaymentMethodType>(PaymentMethodType.TRANSFER);
  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    text: string;
    lat: number;
    lng: number;
  }>();
  const [selectedCompanyDelivery, setSelectedCompanyDelivery] =
    useState<CompanyDelivery | null>(null);
  const [orderNote, setOrderNote] = useState("");

  // 📌 Modal & address state
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Hook para precio del envío
  const { data: priceZone, isLoading: isPriceLoading, refetch } = usePriceZone(
    selectedCompanyDelivery && selectedAddress
      ? {
          companyId: selectedCompanyDelivery.id,
          lat: selectedAddress.lat,
          lng: selectedAddress.lng,
        }
      : ({} as any)
  );

  // Si no hay direcciones, abrimos modal automáticamente
  useEffect(() => {
    if (addresses?.length === 0 && selectedDeliveryOption === "delivery") {
      setShowAddressModal(true);
    }
  }, [addresses, selectedDeliveryOption]);

  // 🔁 Recalcular costo de envío
  useEffect(() => {
    if (selectedCompanyDelivery && selectedAddress) {
      refetch();
    }
  }, [selectedCompanyDelivery, selectedAddress, refetch]);

  // 🟢 Handlers
  const handleSaveAddress = async (address: AddressData) => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar una dirección");
      router.push("/login");
      return;
    }

    const result = await createAddress.mutateAsync({
      city: address.city,
      province: address.province,
      street: address.street,
      apartment: address.apartment ?? undefined,
      country: address.country,
      isDefault: true,
      latitude: address.latitude,
      longitude: address.longitude,
      notes: address.notes ?? undefined,
      number: address.number ?? undefined,
      postalCode: address.postalCode ?? undefined,
      userId,
    });

    await refetchAddresses();

    setSelectedAddress({
      id: result.id,
      text: `${address.street} ${address.number ?? ""}, ${address.city}`,
      lat: address.latitude || 0,
      lng: address.longitude || 0,
    });
    setShowAddressModal(false);
    setActiveStep("deliveryCompany");
  };

  const handleAddressChange = (selection: {
    id: string;
    text: string;
    lat: number;
    lng: number;
  }) => {
    if (selection.id === "new") {
      setShowAddressModal(true);
      setSelectedAddress(undefined);
    } else {
      setSelectedAddress(selection);
      setActiveStep("deliveryCompany");
    }
  };

  const isCheckoutEnabled = useMemo(() => {
    if (!user) return false;
    if (selectedDeliveryOption === "delivery") {
      return !!selectedAddress && !!selectedCompanyDelivery;
    }
    return true;
  }, [user, selectedDeliveryOption, selectedAddress, selectedCompanyDelivery]);

  const orderPayload = useMemo(() => {
    if (!user) return null;
    const subtotal = getTotal();
    const deliveryPrice =
      selectedDeliveryOption === "delivery" && priceZone?.price
        ? priceZone.price
        : 0;
    const total = subtotal + deliveryPrice;

    return {
      userId: userId ?? "",
      businessId,
      customerName: `${user.firstName} ${user.lastName}`,
      customerPhone: user.email,
      businessName,
      businessPhone,
      note: orderNote,
      businessAddress,
      deliveryAddressId:
        selectedDeliveryOption === "delivery" ? selectedAddress?.id : undefined,
      deliveryType: selectedDeliveryOption,
      paymentType: selectedPaymentOption,
      customerAddress:
        selectedDeliveryOption === "delivery"
          ? selectedAddress?.text
          : undefined,
      total: total, // 💡 Incluimos el costo de envío aquí
      subtotal: subtotal,
      deliveryPrice: deliveryPrice,
    };
  }, [
    user,
    userId,
    businessId,
    businessName,
    businessPhone,
    businessAddress,
    orderNote,
    selectedDeliveryOption,
    selectedAddress,
    getTotal,
    selectedPaymentOption,
    priceZone,
  ]);

  const formatPrice = (price: number) =>
    price.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  const renderStepContent = (stepName: Step) => {
    switch (stepName) {
      case "delivery":
        return (
          <DeliveryOptionSelector
            selectedOption={selectedDeliveryOption}
            onChange={(option) => {
              setSelectedDeliveryOption(option);
              if (option === "delivery") {
                setActiveStep("address");
              } else {
                setActiveStep("payment");
              }
            }}
          />
        );
      case "address":
        if (selectedDeliveryOption !== "delivery") return null;
        return (
          <AddressSelector
            addresses={addresses || []}
            selectedId={selectedAddress?.id}
            onChange={handleAddressChange}
            onCreateNew={() => setShowAddressModal(true)}
          />
        );
      case "deliveryCompany":
        if (selectedDeliveryOption !== "delivery" || !selectedAddress)
          return null;
        return (
          <>
            <CompanyDeliverySelector
              selectedCompanyId={selectedCompanyDelivery?.id}
              onChange={(company) => setSelectedCompanyDelivery(company)}
            />
            {selectedCompanyDelivery && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveStep("payment")}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}
          </>
        );
      case "payment":
        return (
          <>
            <PaymentOptionSelector
              selectedOption={selectedPaymentOption}
              onChange={setSelectedPaymentOption}
              isDelivery={selectedDeliveryOption === "delivery"}
            />

            {/* Nuevo: Resumen de la orden */}
            <div className="mt-6 p-4 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold mb-2">Resumen de la Orden</h3>
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">{formatPrice(getTotal())}</span>
              </div>
              {selectedDeliveryOption === "delivery" && (
                <div className="flex justify-between text-gray-700">
                  <span>Costo de envío:</span>
                  <span className="font-medium">
                    {isPriceLoading ? (
                      "Calculando..."
                    ) : priceZone?.price ? (
                      formatPrice(priceZone.price)
                    ) : (
                      "N/A"
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t border-gray-300">
                <span>Total:</span>
                <span>{orderPayload?.total ? formatPrice(orderPayload.total) : formatPrice(0)}</span>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="notes" className="block font-semibold mb-2">
                Notas adicionales para tu pedido
              </label>
              <textarea
                id="notes"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                rows={3}
                className="w-full border rounded-xl p-3 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Ej: Sin cebolla, con extra de salsa..."
              />
            </div>
            {isCheckoutEnabled && orderPayload && (
              <div className="mt-6">
                <SubmitOrderButton orderPayload={orderPayload} />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const getStepTitle = (stepName: Step) => {
    switch (stepName) {
      case "delivery":
        return "1. Elige tu opción de entrega";
      case "address":
        return "2. Selecciona tu dirección";
      case "deliveryCompany":
        return "3. Elige la cadetería";
      case "payment":
        return "4. Selecciona el método de pago";
      default:
        return "";
    }
  };

  const isStepComplete = (stepName: Step): boolean => {
    switch (stepName) {
      case "delivery":
        return !!selectedDeliveryOption;
      case "address":
        return selectedDeliveryOption === "pickup" || !!selectedAddress;
      case "deliveryCompany":
        return selectedDeliveryOption === "pickup" || !!selectedCompanyDelivery;
      case "payment":
        return !!selectedPaymentOption;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 relative max-w-2xl mx-auto">
      {["delivery", "address", "deliveryCompany", "payment"].map((step, index) => {
        const stepName = step as Step;
        const isStepActive = activeStep === stepName;
        const isStepDone =
          isStepComplete(stepName) &&
          (activeStep !== stepName ||
            (isStepActive &&
              (stepName === "address" || stepName === "deliveryCompany")));

        const shouldDisplay =
          selectedDeliveryOption === "pickup"
            ? stepName !== "address" && stepName !== "deliveryCompany"
            : true;

        if (!shouldDisplay) {
          return null;
        }

        return (
          <div
            key={stepName}
            className={`
              p-6 rounded-2xl shadow-lg border transition-all duration-300
              ${isStepActive ? "bg-white border-indigo-500" : "bg-gray-50 border-gray-200"}
              ${!isStepActive && !isStepDone ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                if (isStepActive) return;
                setActiveStep(stepName);
              }}
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                {isStepDone && (
                  <CheckCircle2 className="text-green-500 w-6 h-6" />
                )}
                {getStepTitle(stepName)}
              </h2>
            </div>
            {isStepActive && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                {renderStepContent(stepName)}
              </div>
            )}
          </div>
        );
      })}

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
          showAddressModal
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="bg-white w-full max-w-lg mx-4 rounded-3xl overflow-hidden relative transform transition-transform duration-300 scale-95">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
            onClick={() => setShowAddressModal(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <MapClientWrapper saveAddress={handleSaveAddress} />
        </div>
      </div>
    </div>
  );
}