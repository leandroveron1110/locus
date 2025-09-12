"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/catalog/stores/useCartStore";
import { useCreateOrder } from "@/features/catalog/hooks/useCreateOrder";
import { CreateOrderFull, CreateOrderItem } from "@/features/catalog/types/order";

interface Props {
  orderPayload: CreateOrderFull;
}

export default function SubmitOrderButton({ orderPayload }: Props) {
  const [error, setError] = useState("");
  const { items, getTotal, clearCart } = useCartStore.getState();
  const createOrderMutation = useCreateOrder();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleSubmitOrder = async () => {
    setError("");

    if (!orderPayload.userId || !orderPayload.businessId || !user) {
      setError("Faltan datos para completar la orden.");
      return;
    }

    try {
      // 1️⃣ Mapear productos del carrito
      const mappedItems: CreateOrderItem[] = items.map((cartItem) => ({
        menuProductId: cartItem.product.id,
        productName: cartItem.product.name,
        productDescription: cartItem.product.description,
        productImageUrl: cartItem.product.imageUrl || undefined,
        quantity: cartItem.quantity,
        priceAtPurchase: Number(cartItem.product.finalPrice).toFixed(2), // string decimal
        notes: "", // si agregas observaciones de producto podrías pasarlas aquí
        optionGroups: cartItem.product.optionGroups.map((group) => ({
          groupName: group.name,
          minQuantity: group.minQuantity,
          maxQuantity: group.maxQuantity,
          quantityType: group.quantityType,
          opcionGrupoId: group.id,
          options: group.options.map((opt) => ({
            optionName: opt.name,
            priceModifierType: opt.priceModifierType,
            quantity: 1, // default
            priceFinal: opt.priceFinal,
            priceWithoutTaxes: opt.priceWithoutTaxes,
            taxesAmount: opt.taxesAmount,
            opcionId: opt.id,
          })),
        })),
      }));

      // 2️⃣ Armar payload completo
      const payload: CreateOrderFull = {
        ...orderPayload,
        items: mappedItems,
        total: Number(getTotal().toFixed(2)),
      };

      // 3️⃣ Llamar API
      await createOrderMutation.mutateAsync(payload);

      // 4️⃣ Limpiar carrito y redirigir
      clearCart();
      router.push(`/orders`);
    } catch (err: any) {
      console.error("Error al enviar orden:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Hubo un error al enviar la orden."
      );
    }
  };

  return (
    <>
      <button
        onClick={handleSubmitOrder}
        disabled={createOrderMutation.isPending}
        className={`px-4 py-2 rounded text-white transition ${
          createOrderMutation.isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {createOrderMutation.isPending ? "Enviando..." : "Enviar orden"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
