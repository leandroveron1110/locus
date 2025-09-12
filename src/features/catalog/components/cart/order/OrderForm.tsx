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
import { CreateOrderFull } from "@/features/catalog/types/order";

// 🟢 Componentes UI
import DeliveryOptionSelector from "./DeliveryOptionSelector";
import AddressSelector from "./AddressSelector";
import PaymentOptionSelector from "./PaymentOptionSelector";
import SubmitOrderButton from "./SubmitOrderButton";
import MapClientWrapper from "@/features/locationSelector/components/MapClientWrapper";
import CompanyDeliverySelector from "./CompanyDeliverySelector";
import { formatPrice } from "@/features/common/utils/formatPrice";
import { DeliveryOption } from "@/features/catalog/types/order";

type Step = "delivery" | "address" | "deliveryCompany" | "payment";

interface Props {
  userId?: string;
  businessId: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessAddresslatitude: number,
  businessAddresslongitude: number,
}

export default function OrderForm({
  userId,
  businessId,
  businessName,
  businessPhone,
  businessAddress,
  businessAddresslatitude,
  businessAddresslongitude
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
    useState<DeliveryOption>("DELIVERY");
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

  // Abrir modal si no hay direcciones guardadas
  useEffect(() => {
    if (addresses?.length === 0 && selectedDeliveryOption === "DELIVERY") {
      setShowAddressModal(true);
    }
  }, [addresses, selectedDeliveryOption]);

  // Refetch del precio de envío
  useEffect(() => {
    if (selectedCompanyDelivery && selectedAddress) {
      refetch();
    }
  }, [selectedCompanyDelivery, selectedAddress, refetch]);

  const handleSaveAddress = async (address: AddressData) => {
    if (!userId) {
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
    if (selectedDeliveryOption === "DELIVERY") {
      return !!selectedAddress && !!selectedCompanyDelivery;
    }
    return true;
  }, [user, selectedDeliveryOption, selectedAddress, selectedCompanyDelivery]);

  const isSelectedDeliveryOption = ()=> {
    return selectedDeliveryOption === "DELIVERY"
  }


const orderPayload: CreateOrderFull | null = useMemo(() => {
  if (!user) return null;

  const subtotal = getTotal();
  const deliveryPrice =
    isSelectedDeliveryOption() && priceZone?.price ? priceZone.price : 0;
  const total = subtotal + deliveryPrice;

  return {
    userId: userId ?? "",
    businessId,
    deliveryAddressId: undefined, // donde busca el pedido el cadete
    pickupAddressId: isSelectedDeliveryOption() ? selectedAddress?.id : undefined, // donde tiene que llevarlo
    deliveryCompanyId: isSelectedDeliveryOption()
      ? selectedCompanyDelivery?.id
      : undefined,

    // --- Snapshot del cliente ---
    customerName: `${user.firstName} ${user.lastName}`,
    customerPhone: user.email,
    customerAddress: isSelectedDeliveryOption()
      ? selectedAddress?.text
      : undefined,
    customerObservations: undefined,
    customerAddresslatitude: isSelectedDeliveryOption()
      ? selectedAddress?.lat
      : undefined,
    customerAddresslongitude: isSelectedDeliveryOption()
      ? selectedAddress?.lng
      : undefined,

    // --- Snapshot del negocio ---
    businessName,
    businessPhone,
    businessAddress,
    businessAddresslatitude: businessAddresslatitude,
    businessAddresslongitude: businessAddresslongitude,

    // --- Snapshot de delivery ---
    deliveryCompanyName: selectedCompanyDelivery?.name,
    deliveryCompanyPhone: selectedCompanyDelivery?.phone,
    totalDelivery: isSelectedDeliveryOption() ? deliveryPrice : undefined,

    // --- Pagos ---
    paymentType: selectedPaymentOption,
    paymentStatus: "PENDING", // 🔹 obligatorio

    deliveryType: selectedDeliveryOption,
    total,
    notes: orderNote,

    items: [], // se rellenan en SubmitOrderButton
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
  selectedPaymentOption,
  selectedCompanyDelivery,
  getTotal,
  priceZone,
]);


  // Pasos
  const steps: { key: Step; title: string; content: React.ReactNode }[] = [
    {
      key: "delivery",
      title: "1. Elige tu opción de entrega",
      content: (
        <DeliveryOptionSelector
          selectedOption={selectedDeliveryOption}
          onChange={(option) => {
            setSelectedDeliveryOption(option);
            setActiveStep(option === "DELIVERY" ? "address" : "payment");
          }}
        />
      ),
    },
    {
      key: "address",
      title: "2. Selecciona tu dirección",
      content: (
        <AddressSelector
          addresses={addresses || []}
          selectedId={selectedAddress?.id}
          onChange={handleAddressChange}
          onCreateNew={() => setShowAddressModal(true)}
        />
      ),
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
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continuar
            </button>
          )}
        </>
      ),
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

          <div className="mt-6 p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold mb-2">Resumen de la Orden</h3>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-medium">{formatPrice(getTotal())}</span>
            </div>
            {selectedDeliveryOption === "DELIVERY" && (
              <>
                <div className="flex justify-between text-gray-700">
                  <span>Costo de envío:</span>
                  <span className="font-medium">
                    {isPriceLoading
                      ? "Calculando..."
                      : priceZone?.price
                      ? formatPrice(priceZone.price)
                      : "N/A"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 italic">
                  El costo de envío mostrado es un{" "}
                  <strong className="font-semibold">precio base</strong>, puede
                  variar si el pedido excede las condiciones estándar (peso,
                  tamaño u otros ajustes).
                </p>
              </>
            )}
            <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t border-gray-300">
              <span>Total:</span>
              <span>{formatPrice(orderPayload?.total ?? 0)}</span>
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
              className="w-full border rounded-xl p-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Sin cebolla, con extra de salsa..."
            />
          </div>

          {isCheckoutEnabled && orderPayload && (
            <div className="mt-6">
              <SubmitOrderButton orderPayload={orderPayload} />
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 relative">
      {steps
        .filter(
          (s) =>
            selectedDeliveryOption === "PICKUP"
              ? s.key !== "address" && s.key !== "deliveryCompany"
              : true
        )
        .map(({ key, title, content }) => {
          const isActive = activeStep === key;
          const isDone = key !== "payment" && key !== "delivery" && isActive;

          return (
            <div
              key={key}
              className={`p-6 rounded-2xl shadow-lg border transition-all ${
                isActive
                  ? "bg-white border-indigo-500"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setActiveStep(key)}
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {isDone && <CheckCircle2 className="text-green-500 w-6 h-6" />}
                  {title}
                </h2>
              </div>
              {isActive && <div className="mt-4">{content}</div>}
            </div>
          );
        })}

      {/* Modal dirección */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg mx-4 rounded-3xl overflow-hidden relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setShowAddressModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <MapClientWrapper saveAddress={handleSaveAddress} />
          </div>
        </div>
      )}
    </div>
  );
}
