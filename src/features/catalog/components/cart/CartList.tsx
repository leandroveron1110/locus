"use client";
import React, { useState } from "react";
import { CartItem, useCartStore } from "../../stores/useCartStore";
import CartSummary from "./CartSummary";
import CartItemModal from "./CartItemModal";
import CartItemCard from "./CartItemCard";
import OrderForm from "./order/OrderForm";
import { BusinessPaymentMethod } from "../../types/business";
import BackButton from "@/features/common/ui/BackButton/BackButton";

interface Props {
  userId?: string;
  businessId: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessPaymentMethod?: BusinessPaymentMethod[];
}

export default function CartList(props: Props) {
  const { items, removeItem, clearCart, getTotal } = useCartStore();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [step, setStep] = useState<"cart" | "summary" | "order">("cart");

  if (items.length === 0) {
    return (
      <p className="text-center mt-8 text-gray-600">Tu carrito está vacío.</p>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-y-auto p-4 box-border">
      {/* Paso: Carrito */}
      {step === "cart" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Tu carrito</h2>
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.cartItemId}
                item={item}
                onEdit={setEditingItem}
                onRemove={removeItem}
              />
            ))}
          </div>
          <button
            onClick={() => setStep("summary")}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Continuar
          </button>
        </>
      )}

      {/* Paso: Resumen */}
      {step === "summary" && (
        <>
          <div className="flex items-center mb-4">
            <BackButton onClick={() => setStep("cart")} />
            <h2 className="text-xl font-semibold ml-4">Resumen de compra</h2>
          </div>

          <CartSummary total={getTotal()} onClear={clearCart} />

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setStep("order")}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Confirmar
            </button>
          </div>
        </>
      )}

      {/* Paso: Orden */}
      {step === "order" && (
        <>
          <div className="flex items-center mb-4">
            <BackButton onClick={() => setStep("summary")} />
            <h2 className="text-xl font-semibold ml-4">Finalizar compra</h2>
          </div>

          <OrderForm {...props} />
        </>
      )}

      {/* Modal de edición */}
      {editingItem && (
        <CartItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
