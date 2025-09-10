"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useAddress, useAddresses } from "../../../hooks/useAddress";
import { Address, AddressCreateDto } from "../../../types/address";
import { useCartStore } from "@/features/catalog/stores/useCartStore";
import DeliveryOptionSelector from "./DeliveryOptionSelector";
import AddressSelector from "./AddressSelector";
import SubmitOrderButton from "./SubmitOrderButton";
import { useRouter } from "next/navigation";
import PaymentOptionSelector from "./PaymentOptionSelector";
import { PaymentMethodType } from "@/features/orders/types/order";
import MapClientWrapper from "@/features/locationSelector/components/MapClientWrapper";
import { X } from "lucide-react";

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
  const [showMap, setShowMap] = useState(false); // Nuevo estado para mostrar/ocultar mapa
  const [orderNote, setOrderNote] = useState("");

  const [newAddress, setNewAddress] = useState<Address>({
    city: "Concepción del Uruguay",
    province: "Entre Ríos",
    country: "Argentina",
    postalCode: "3260",
    street: "",
  });

  // Mostrar formulario automáticamente si no hay direcciones
  useEffect(() => {
    if (addresses?.length === 0 && selectedDeliveryOption === "delivery") {
      setShowAddressForm(true);
    }
  }, [addresses, selectedDeliveryOption]);

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
          setShowMap(false);
        },
        onError: (error) => {
          alert("Error al crear dirección: " + error.message);
        },
      }
    );
  };

  const handleAddressChange = (selection: { id: string; text: string }) => {
    if (selection.id === "new") {
      setShowAddressForm(true);
      setShowMap(true); // Abrir mapa al crear nueva dirección
      setSelectedAddress(undefined);
    } else {
      setSelectedAddress(selection);
      setShowAddressForm(false);
      setShowMap(false);
    }
  };

  const isCheckoutEnabled = useMemo(() => {
    if (!user) return false;
    if (selectedDeliveryOption === "delivery" && !selectedAddress) return false;
    return true;
  }, [user, selectedDeliveryOption, selectedAddress]);

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
        selectedDeliveryOption === "delivery"
          ? selectedAddress?.text
          : undefined,
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

  return (
    <div className="space-y-6 relative">
      {/* Opciones de entrega */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Opciones de entrega</h2>
        <DeliveryOptionSelector
          selectedOption={selectedDeliveryOption}
          onChange={setSelectedDeliveryOption}
        />
      </section>

      {/* Dirección */}
      {selectedDeliveryOption === "delivery" && userId && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          {!showAddressForm && (
            <AddressSelector
              addresses={addresses as AddressCreateDto[]}
              selectedId={selectedAddress?.id}
              onChange={handleAddressChange}
              onCreateNew={() => {
                setShowAddressForm(true);
                setShowMap(true);
              }}
            />
          )}

          {/* Si se está creando nueva dirección */}
          {showAddressForm && (
            <div className="space-y-3 mt-2">
              {showMap && (
                <div className="relative">
                  <button
                    className="absolute top-0 right-0 z-10 text-gray-600 hover:text-gray-900 p-2"
                    onClick={() => setShowMap(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <MapClientWrapper />
                </div>
              )}

              {/* Si el mapa está cerrado, volver a mostrar AddressSelector */}
              {!showMap && (
                <AddressSelector
                  addresses={addresses as AddressCreateDto[]}
                  selectedId={selectedAddress?.id}
                  onChange={handleAddressChange}
                  onCreateNew={() => setShowMap(true)}
                />
              )}
            </div>
          )}
        </section>
      )}

      {/* Método de pago */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <PaymentOptionSelector
          selectedOption={selectedPaymentOption}
          onChange={setSelectedPaymentOption}
          isDelivery={selectedDeliveryOption === "delivery"}
        />
      </section>

      {/* Notas del pedido */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label htmlFor="notes" className="block font-semibold mb-2">
          Notas adicionales para tu pedido
        </label>
        <textarea
          id="notes"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          rows={3}
          className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ej: Sin cebolla, con extra de salsa..."
        />
      </section>

      {/* Botón de checkout */}
      {isCheckoutEnabled && orderPayload && (
        <div className="flex justify-end">
          <SubmitOrderButton orderPayload={orderPayload} />
        </div>
      )}
    </div>
  );
}
