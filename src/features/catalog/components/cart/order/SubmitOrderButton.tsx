"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/catalog/stores/useCartStore";
import { useCreateOrder } from "@/features/catalog/hooks/useCreateOrder";
import { mapCartToOrderPayload } from "@/features/catalog/stores/createOrderFull";

interface Props {
  orderPayload: {
    userId: string;
    businessId: string;
    note: string;
    deliveryAddressId?: string;
    pickupAddressId?: string;
    customerAddress?: string;
    customerObservations?: string;
    businessName: string;
    businessPhone: string;
    businessAddress: string;
    businessObservations?: string;
    paymentType?: "CASH" | "TRANSFER" | "DELIVERY";
    paymentInstructions?: string;
    paymentHolderName?: string;
  };
}

export default function SubmitOrderButton({
  orderPayload: {
    userId,
    businessId,
    note,
    deliveryAddressId,
    pickupAddressId,
    customerAddress,
    customerObservations,
    businessName,
    businessPhone,
    businessAddress,
    businessObservations,
    paymentType,
    paymentInstructions,
    paymentHolderName,
  },
}: Props) {
  const [error, setError] = useState("");
  const { clearCart } = useCartStore();
  const createOrderMutation = useCreateOrder();
  const router = useRouter();
  const userStore = useAuthStore((state) => state.user);

  const handleSubmitOrder = async () => {
    setError("");

    if (
      !userId ||
      !businessId ||
      !userStore
    ) {
      setError("Faltan datos para completar la orden.");
      return;
    }

    try {
      // 1️⃣ Construir payload
      const payload = mapCartToOrderPayload({
        userId,
        businessId,
        customerName: `${userStore.firstName} ${userStore.lastName}`,
        customerPhone: userStore.email,
        customerAddress,
        customerObservations,
        businessName,
        businessPhone,
        businessAddress,
        businessObservations,
        deliveryAddressId,
        pickupAddressId,
        notes: note,
        paymentType,
        paymentInstructions,
        paymentHolderName,
      });

      // 2️⃣ Crear orden vía API
      const order = await createOrderMutation.mutateAsync(payload);
      // 3️⃣ Limpiar carrito
      clearCart();
      router.push(`/orders`);

      // ✅ Ya no necesitamos iniciar el socket aquí.
      // La página de órdenes (`useOrders`) lo maneja de forma global
      // y agregará esta orden automáticamente cuando el backend emita `order_created`.
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Hubo un error al enviar la orden.";
      setError(message);
    }
  };

  return (
    <>
      <button
        onClick={handleSubmitOrder}
        disabled={createOrderMutation.isPending}
        className={`px-4 py-2 rounded text-white ${
          createOrderMutation.isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500"
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
