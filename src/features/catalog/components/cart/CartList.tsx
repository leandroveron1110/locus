"use client";
import React, { useState } from "react";
import { CartItem, useCartStore } from "../../stores/useCartStore";
import CartSummary from "./CartSummary";
import CartItemModal from "./CartItemModal";
import CartItemCard from "./CartItemCard";
import OrderForm from "./order/OrderForm";
import { BusinessPaymentMethod } from "../../types/business";

interface Props {
  userId?: string;
  businessId: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessPaymentMethod?: BusinessPaymentMethod[]
}

export default function CartList(props: Props) {
  const { items, removeItem, clearCart, getTotal } = useCartStore();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

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

      {/* La parte de la orden queda afuera en su propio form */}
      <OrderForm {...props} />

      {editingItem && (
        <CartItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
