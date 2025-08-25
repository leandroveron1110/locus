// src/components/OrderForm.tsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useAddress, useAddresses } from "../../../hooks/useAddress";
import { Address, AddressCreateDto } from "../../../types/address";
import { useCartStore } from "@/features/catalog/stores/useCartStore";
import DeliveryOptionSelector from "./DeliveryOptionSelector";
import AddressSelector from "./AddressSelector";
import AddressForm from "./AddressForm";
import SubmitOrderButton from "./SubmitOrderButton";
import { useRouter } from "next/navigation";
import PaymentOptionSelector from "./PaymentOptionSelector";
import { PaymentMethodType } from "@/features/orders/types/order";
import { BusinessPaymentMethod } from "@/features/catalog/types/business";

type DeliveryOption = "pickup" | "delivery";

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

  const createAddress = useAddress();
  const { data: addresses } = useAddresses(userId);

  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<DeliveryOption>("delivery");
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<PaymentMethodType>(PaymentMethodType.TRANSFER);
  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    text: string;
  }>();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderNote, setOrderNote] = useState<string>("");

  const [newAddress, setNewAddress] = useState<Address>({
    city: "Concepción del Uruguay",
    province: "Entre Ríos",
    country: "Argentina",
    postalCode: "3260",
    street: "",
  });

  // Si no hay direcciones guardadas y selecciona delivery → abrir form
  useEffect(() => {
    if (addresses?.length === 0 && selectedDeliveryOption === "delivery") {
      setShowAddressForm(true);
    }
  }, [addresses, selectedDeliveryOption]);

  // Guardar nueva dirección
  const handleSaveAddress = () => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar una dirección");
      router.push("/login");
      return;
    }

    createAddress.mutate(
      { ...newAddress, userId },
      {
        onSuccess: (data) => {
          const text = `${data.street} ${data.number ?? ""}, ${data.city}`;
          setSelectedAddress({ id: data.id, text });
          setShowAddressForm(false);
        },
        onError: (error) => {
          alert("Error al crear dirección: " + error.message);
        },
      }
    );
  };

  // Cambiar dirección seleccionada
  const handleAddressChange = (selection: { id: string; text: string }) => {
    if (selection.id === "new") {
      setShowAddressForm(true);
      setSelectedAddress(undefined);
    } else {
      setSelectedAddress(selection);
      setShowAddressForm(false);
    }
  };

  // Validaciones para habilitar checkout
  const isCheckoutEnabled = useMemo(() => {
    if (!user) return false;
    if (selectedDeliveryOption === "delivery" && !selectedAddress) return false;
    return true;
  }, [user, selectedDeliveryOption, selectedAddress]);

  // Payload para enviar la orden
  const orderPayload = useMemo(() => {
    if (!user) return null;

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
        selectedDeliveryOption === "delivery" ? selectedAddress?.text : undefined,
      total: getTotal(),
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
  ]);

  // Checkout handler
  const handleCheckout = () => {
    if (!user) {
      alert("Debes iniciar sesión para continuar");
      router.push("/login");
      return;
    }

    if (selectedDeliveryOption === "delivery" && !selectedAddress) {
      alert("Debes seleccionar o agregar una dirección para delivery");
      return;
    }

    if (
      selectedDeliveryOption === "pickup" &&
      selectedPaymentOption === PaymentMethodType.DELIVERY
    ) {
      alert("No puedes pagar al delivery si retiras el pedido.");
      return;
    }
  };

  return (
    <div className="space-y-6">
      <DeliveryOptionSelector
        selectedOption={selectedDeliveryOption}
        onChange={setSelectedDeliveryOption}
      />

      {selectedDeliveryOption === "delivery" && userId && (
        <>
          {addresses && addresses.length > 0 && !showAddressForm && (
            <AddressSelector
              addresses={addresses as AddressCreateDto[]}
              selectedId={selectedAddress?.id}
              onChange={handleAddressChange}
              onCreateNew={() => setShowAddressForm(true)}
            />
          )}

          {showAddressForm && (
            <AddressForm
              address={newAddress}
              onChange={(data) =>
                setNewAddress((prev) => ({ ...prev, ...data }))
              }
              onSave={handleSaveAddress}
            />
          )}
        </>
      )}

      <PaymentOptionSelector
        selectedOption={selectedPaymentOption}
        onChange={setSelectedPaymentOption}
        isDelivery={selectedDeliveryOption === "delivery"}
      />
      
      {/* Nuevo bloque para mostrar los detalles de transferencia
      {selectedPaymentOption === PaymentMethodType.TRANSFER && (
        <TransferDetails paymentMethods={businessPaymentMethod || []} />
      )} */}

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label htmlFor="notes" className="block font-semibold mb-2">
          Notas adicionales para tu pedido:
        </label>
        <textarea
          id="notes"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          rows={3}
          className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: Sin cebolla, con extra de salsa..."
        />
      </div>

      {isCheckoutEnabled && orderPayload && (
        <div onClick={handleCheckout}>
          <SubmitOrderButton orderPayload={orderPayload} />
        </div>
      )}
    </div>
  );
}