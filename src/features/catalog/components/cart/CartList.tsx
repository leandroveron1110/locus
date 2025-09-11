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
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <ShoppingCart size={48} className="mb-3 opacity-50" />
        <p className="text-lg">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-2xl flex flex-col p-4 bg-white shadow-md rounded-2xl">
        {/* Indicador de pasos */}
        <div className="flex justify-between mb-4 text-sm text-gray-500">
          <span className={step === "cart" ? "font-bold text-indigo-600" : ""}>
            1. Carrito
          </span>
          <span className={step === "order" ? "font-bold text-indigo-600" : ""}>
            2. Finalizar compra
          </span>
        </div>

        {/* Paso: Carrito */}
        {step === "cart" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Tu carrito</h2>
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.cartItemId}
                  item={item}
                  onEdit={setEditingItem}
                  onRemove={removeItem}
                />
              ))}
              <CartSummary total={getTotal()} onClear={clearCart} />
            </div>

            {/* Botón sticky */}
            <div className="sticky bottom-0 bg-white p-4 shadow-lg">
              <button
                onClick={() => setStep("order")}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Paso: Orden */}
        {step === "order" && (
          <>
            <div className="flex items-center mb-4">
              <BackButton onClick={() => setStep("cart")} />
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
    </div>
  );
}
