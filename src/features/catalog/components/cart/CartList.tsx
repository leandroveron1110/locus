"use client";
import React, { useEffect, useState } from "react";
import { CartItem, useCartStore } from "../../stores/useCartStore";
import CartSummary from "./CartSummary";
import AddressSelector from "./AddressSelector";
import AddressForm from "./AddressForm";
import CartItemModal from "./CartItemModal";
import CartItemCard from "./CartItemCard";
import SubmitOrderButton from "./SubmitOrderButton";
import { useAddress, useAddresses } from "../../hooks/useAddress";
import { Address, AddressCreateDto } from "../../types/address";

interface Props {
  userId?: string;
  businessId: string;
}

export default function CartList({ userId, businessId }: Props) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const createAddress = useAddress();
  const { data: addresses, isLoading } = useAddresses(userId);

  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [savedAddresses, setSavedAddresses] = useState<AddressCreateDto[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    city: "Concepción del Uruguay",
    province: "Entre Ríos",
    country: "Argentina",
    postalCode: "3260",
    street: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (addresses) {
      setSavedAddresses(addresses);

      // Si no hay direcciones, mostrar formulario para crear una
      if (addresses.length === 0) {
        setShowAddressForm(true);
      }
    }
  }, [addresses]);

  const handleProceedToCheckout = () => {
    if (!userId) return alert("Debes iniciar sesión para continuar.");
    if (savedAddresses.length === 0 || selectedAddressId === "new") {
      setShowAddressForm(true);
      return;
    }
    if (!selectedAddressId) {
      alert("Selecciona una dirección o crea una nueva.");
      return;
    }


  };

  const handleSaveAddress = () => {
    if (!userId)
      return alert("Debes iniciar sesión para agregar una dirección");

    const payload: Address = {
      ...newAddress,
      userId: userId,
    };

    createAddress.mutate(payload, {
      onSuccess: (data) => {
        console.log("Dirección creada:", data);
        setShowAddressForm(false);
        setSelectedAddressId(data.id); // usar la nueva dirección
        // Aquí podrías hacer un refetch de direcciones guardadas
      },
      onError: (error) => {
        alert("Error al crear dirección: " + error.message);
      },
    });
  };

  if (items.length === 0) {
    return (
      <p className="text-center mt-8 text-gray-600">Tu carrito está vacío.</p>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Tu carrito</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <CartItemCard
            key={item.cartItemId}
            item={item}
            onEdit={setEditingItem}
            onRemove={removeItem}
          />
        ))}
      </div>

      <CartSummary total={getTotal()} onClear={clearCart} />

      {userId && savedAddresses.length > 0 && !showAddressForm && (
        <AddressSelector
          addresses={savedAddresses}
          selectedId={selectedAddressId}
          onChange={setSelectedAddressId}
          onCreateNew={() => setShowAddressForm(true)}
        />
      )}

      {showAddressForm && (
        <AddressForm
          address={newAddress}
          onChange={(data) => setNewAddress((prev) => ({ ...prev, ...data }))}
          onSave={handleSaveAddress}
        />
      )}

      {userId && selectedAddressId && !showAddressForm && (
        <div onClick={handleProceedToCheckout}>
          <SubmitOrderButton
            userId={userId}
            businessId={businessId}
            note={""}
            deliveryAddressId={""}
            pickupAddressId= {selectedAddressId}
          />
        </div>
      )}

      {editingItem && (
        <CartItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
