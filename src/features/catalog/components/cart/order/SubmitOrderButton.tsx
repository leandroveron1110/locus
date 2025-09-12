// src/components/SubmitOrderButton.tsx
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
  // Es mejor usar el hook de Zustand directamente para que el componente re-renderice
  const { items, getTotal, clearCart } = useCartStore();
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
      // 1️⃣ Lógica de Mapeo Corregida
      const mappedItems: CreateOrderItem[] = items.map((cartItem) => {
        // Encontrar los grupos de opciones seleccionados y sus opciones
        const mappedOptionGroups = cartItem.selectedOptions
          ? Object.values(
              cartItem.selectedOptions.reduce((acc, selectedOpt) => {
                // Encontrar la opción original en la estructura del producto
                let originalOption;
                let originalGroup;

                // Bucle para encontrar la opción original
                for (const group of cartItem.product.optionGroups) {
                  originalOption = group.options.find(
                    (opt) => opt.id === selectedOpt.id
                  );
                  if (originalOption) {
                    originalGroup = group;
                    break;
                  }
                }

                // Si se encuentra la opción, mapearla a la estructura deseada
                if (originalOption && originalGroup) {
                  if (!acc[originalGroup.id]) {
                    acc[originalGroup.id] = {
                      groupName: originalGroup.name,
                      minQuantity: originalGroup.minQuantity,
                      maxQuantity: originalGroup.maxQuantity,
                      quantityType: originalGroup.quantityType,
                      opcionGrupoId: originalGroup.id,
                      options: [],
                    };
                  }
                  
                  // Añadir la opción seleccionada con todos los detalles
                  acc[originalGroup.id].options.push({
                    optionName: originalOption.name,
                    priceModifierType: originalOption.priceModifierType,
                    quantity: 1, // Por ahora 1, si permites múltiples de la misma opción, se ajusta aquí
                    priceFinal: originalOption.priceFinal,
                    priceWithoutTaxes: originalOption.priceWithoutTaxes,
                    taxesAmount: originalOption.taxesAmount,
                    opcionId: originalOption.id,
                  });
                }
                return acc;
              }, {} as Record<string, any>)
            )
          : [];

        // Retornar el objeto mapeado completo del ítem del carrito
        return {
          menuProductId: cartItem.product.id,
          productName: cartItem.product.name,
          productDescription: cartItem.product.description,
          productImageUrl: cartItem.product.imageUrl || undefined,
          quantity: cartItem.quantity,
          priceAtPurchase: Number(cartItem.product.finalPrice).toFixed(2),
          notes: "",
          optionGroups: mappedOptionGroups,
        };
      });

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