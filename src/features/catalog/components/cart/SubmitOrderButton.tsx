"use client";
import { useState } from "react";
import { useCartStore } from "../../stores/useCartStore";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import { mapCartToOrderPayload } from "../../stores/createOrderFull";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  businessId: string;
  note: string;
  deliveryAddressId?: string;
  pickupAddressId?: string;
}

export default function SubmitOrderButton({
  userId,
  businessId,
  note,
  deliveryAddressId,
  pickupAddressId,
}: Props) {
  const [error, setError] = useState("");
  const { clearCart } = useCartStore();
  const createOrderMutation = useCreateOrder();
  const router = useRouter();

  const handleSubmitOrder = async () => {
    setError("");

    if (!userId || !businessId || (!deliveryAddressId && !pickupAddressId)) {
      setError("Faltan datos para completar la orden.");
      return;
    }

    try {
      // 1️⃣ Construir payload
      const payload = mapCartToOrderPayload(
        userId,
        businessId,
        deliveryAddressId,
        pickupAddressId,
        note
      );

      // 2️⃣ Crear orden vía API
      const order = await createOrderMutation.mutateAsync(payload);
      console.log("Orden creada:", order);

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
