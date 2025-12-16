// src/components/OrderFormContainer.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// 🟢 Stores & Hooks
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/catalog/stores/useCartStore";

// 🟢 Tipos
import { PaymentMethodType } from "@/features/orders/types/order";
import { CompanyDeliveryWithPrice } from "@/features/catalog/types/zone";
import { AddressData } from "@/features/locationSelector/types/address-data";
import { CreateOrderFull } from "@/features/catalog/types/order";
import { DeliveryOption } from "@/features/catalog/types/order";

// 🟢 Componentes UI (nuevos)
import { useAddress, useAddresses } from "@/features/catalog/hooks/useAddress";
import OrderStepsUI from "./OrderStepsUI";
import AddressModal from "./AddressModal";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  userId?: string;
  businessId: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessAddresslatitude: number;
  businessAddresslongitude: number;
}

type Step = "deliveryInfo" | "payment";
type CadetPaymentMethod = "cash" | "transfer";

export default function OrderFormContainer({
  userId,
  businessId,
  businessName,
  businessPhone,
  businessAddress,
  businessAddresslatitude,
  businessAddresslongitude,
}: Props) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { getTotal, getPaymentBreakdown } = useCartStore();

  console.log("getTotal", getTotal());

  const createAddress = useAddress();
  const {
    data: addresses,
    refetch: refetchAddresses,
    isError,
    error,
  } = useAddresses(userId);

  // 🟢 Estados principales
  const [activeStep, setActiveStep] = useState<Step>("deliveryInfo");
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<DeliveryOption>("DELIVERY");
  const [selectedCadetPayment, setSelectedCadetPayment] =
    useState<CadetPaymentMethod>("cash");
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<PaymentMethodType>(PaymentMethodType.TRANSFER);

  const [selectedPaymentOptionDelivery, setSelectedPaymentOptionDelivery] =
    useState<PaymentMethodType>(PaymentMethodType.TRANSFER);
  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    text: string;
    lat: number;
    lng: number;
    notes: string;
  }>();
  const [selectedCompanyDelivery, setSelectedCompanyDelivery] =
    useState<CompanyDeliveryWithPrice | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Hook para precio del envío
  // const priceZoneParams =
  //   selectedCompanyDelivery && selectedAddress
  //     ? {
  //         companyId: selectedCompanyDelivery.id,
  //         lat: selectedAddress.lat,
  //         lng: selectedAddress.lng,
  //       }
  //     : undefined;

  // const {
  //   data: priceZone,
  //   isLoading: isPriceLoading,
  //   refetch,
  //   isError: isErrorPriceZone,
  //   error: errorPriceZone,
  // } = usePriceZone(priceZoneParams);

  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

  // useEffect(() => {
  //   if (isErrorPriceZone) {
  //     addAlert({
  //       message: getDisplayErrorMessage(errorPriceZone),
  //       type: "error",
  //     });
  //   }
  // }, [isErrorPriceZone, errorPriceZone, addAlert]);

  // Lógica para abrir el modal si no hay direcciones
  useEffect(() => {
    if (addresses?.length === 0 && selectedDeliveryOption === "DELIVERY") {
      setShowAddressModal(true);
    }
  }, [addresses, selectedDeliveryOption]);

  // Refetch del precio de envío
  // useEffect(() => {
  //   if (selectedCompanyDelivery && selectedAddress) {
  //     refetch();
  //   }
  // }, [selectedCompanyDelivery, selectedAddress, refetch]);

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

    if (result) {
      await refetchAddresses();

      setSelectedAddress({
        id: result.id,
        text: `${address.street} ${address.number ?? ""}, ${address.city}`,
        lat: address.latitude || 0,
        lng: address.longitude || 0,
        notes: result.notes || "",
      });
      setShowAddressModal(false);
      setActiveStep("payment");
    }
  };

  const handleAddressChange = (selection: {
    id: string;
    text: string;
    lat: number;
    lng: number;
    notes: string;
  }) => {
    if (selection.id === "new") {
      setShowAddressModal(true);
      setSelectedAddress(undefined);
    } else {
      setSelectedAddress(selection);
    }
    setSelectedCompanyDelivery(null);
  };

  const orderPayload: CreateOrderFull | null = useMemo(() => {
    if (!user) return null;
    const isSelectedDeliveryOption = () =>
      selectedDeliveryOption === "DELIVERY";
    const subtotal = getTotal();
    const deliveryPrice =
      isSelectedDeliveryOption() && selectedCompanyDelivery?.price
        ? selectedCompanyDelivery.price
        : 0;
    const total = subtotal + deliveryPrice;

    return {
      userId: userId ?? "",
      businessId,
      deliveryAddressId: undefined,
      pickupAddressId: isSelectedDeliveryOption()
        ? selectedAddress?.id
        : undefined,
      deliveryCompanyId: isSelectedDeliveryOption()
        ? selectedCompanyDelivery?.idCompany
        : undefined,

      customerName: `${user.firstName} ${user.lastName}`,
      customerPhone: user.email,
      customerAddress: isSelectedDeliveryOption()
        ? selectedAddress?.text
        : undefined,
      customerObservations: isSelectedDeliveryOption()
        ? selectedAddress?.notes
        : undefined,
      customerAddresslatitude: isSelectedDeliveryOption()
        ? selectedAddress?.lat
        : undefined,
      customerAddresslongitude: isSelectedDeliveryOption()
        ? selectedAddress?.lng
        : undefined,

      businessName,
      businessPhone,
      businessAddress,
      businessAddresslatitude,
      businessAddresslongitude,
      deliveryCompanyName: selectedCompanyDelivery?.name,
      deliveryCompanyPhone: selectedCompanyDelivery?.phone,
      totalDelivery: isSelectedDeliveryOption() ? deliveryPrice : undefined,
      paymentType: selectedPaymentOption,
      paymentStatus: "PENDING",
      deliveryType: selectedDeliveryOption,
      total,
      notes: orderNote,

      items: [],
    };
  }, [
    user,
    userId,
    businessId,
    businessName,
    businessPhone,
    businessAddress,
    orderNote,
    businessAddresslatitude,
    businessAddresslongitude,
    selectedDeliveryOption,
    selectedAddress,
    selectedPaymentOption,
    selectedCompanyDelivery,
    getTotal,
    selectedCompanyDelivery,
  ]);

  const canCreateOrder = useMemo(() => {
    if (!user) return false;
    if (selectedDeliveryOption === "PICKUP") return true;
    return !!selectedCompanyDelivery && selectedCompanyDelivery?.price != null;
  }, [
    user,
    selectedDeliveryOption,
    selectedCompanyDelivery,
    selectedCompanyDelivery,
  ]);

  return (
    <>
      <OrderStepsUI
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        selectedDeliveryOption={selectedDeliveryOption}
        setSelectedDeliveryOption={setSelectedDeliveryOption}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        selectedCadetPayment={selectedCadetPayment}
        setSelectedCadetPayment={setSelectedCadetPayment}
        handleAddressChange={handleAddressChange}
        addresses={addresses || []}
        selectedCompanyDelivery={selectedCompanyDelivery}
        setSelectedCompanyDelivery={setSelectedCompanyDelivery}
        selectedPaymentOption={selectedPaymentOption}
        setSelectedPaymentOption={setSelectedPaymentOption}
        orderPayload={orderPayload}
        canCreateOrder={canCreateOrder}
        priceZone={
          selectedCompanyDelivery
            ? {
                message: selectedCompanyDelivery.priceMessage || "",
                price: selectedCompanyDelivery.price,
              }
            : undefined
        }
        orderNote={orderNote}
        setOrderNote={setOrderNote}
        lat={selectedAddress?.lat}
        lng={selectedAddress?.lng}
        paymentBreakdown={{
          cash: getPaymentBreakdown(selectedPaymentOption).cash,
          transfer: getPaymentBreakdown(selectedPaymentOption).transfer,
          qr: getPaymentBreakdown(selectedPaymentOption).qr,
          total: getPaymentBreakdown(selectedPaymentOption).total,
          delivery: selectedCompanyDelivery?.price
        }}
      />

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSaveAddress={handleSaveAddress}
      />
    </>
  );
}
