// src/components/CartList.tsx
"use client";
import React, { useState } from "react";
import { CartItem, useCartStore } from "../../stores/useCartStore";
import CartSummary from "./CartSummary";
import CartItemModal from "./CartItemModal";
import CartItemCard from "./CartItemCard";
import OrderForm from "./order/OrderForm";
import { BusinessPaymentMethod } from "../../types/business";
import BackButton from "@/features/common/ui/BackButton/BackButton";
import { ShoppingCart } from "lucide-react";
import OrderFormContainer from "./order/OrderFormContainer/OrderFormContainer";

interface Props {
  userId?: string;
  businessId: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessAddresslatitude: number;
  businessAddresslongitude: number;
  businessPaymentMethod?: BusinessPaymentMethod[];
}

export default function CartList(props: Props) {
  const { items, removeItem, clearCart, getTotal } = useCartStore();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [step, setStep] = useState<"cart" | "order">("cart");

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <ShoppingCart size={48} className="mb-3 opacity-50" />
        <p className="text-lg font-medium">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Paso: Carrito */}
      {step === "cart" && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <CartItemCard
                key={item.cartItemId}
                item={item}
                onEdit={setEditingItem}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Resumen y botón */}
          <div className="flex-shrink-0 border-t pt-3 mt-3">
            <CartSummary total={getTotal()} onClear={clearCart} />
            <button
              onClick={() => setStep("order")}
              className="w-full mt-3 bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all duration-200"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Paso: Orden */}
      {step === "order" && (
        <div className="">
          <div className="flex items-center mb-4">
            <BackButton onClick={() => setStep("cart")} />
            <h2 className="text-lg font-semibold ml-3 text-gray-900">
              Finalizar compra
            </h2>
          </div>
          <OrderFormContainer {...props} />
        </div>
      )}

      {/* Modal de edición */}
      {editingItem && (
        <CartItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}