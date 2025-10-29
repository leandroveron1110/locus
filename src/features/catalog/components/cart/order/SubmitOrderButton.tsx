// src/components/SubmitOrderButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/catalog/stores/useCartStore";
import { useCreateOrder } from "@/features/catalog/hooks/useCreateOrder";
import {
  CreateOrderFull,
  CreateOrderItem,
  CreateOrderOptionGroup,
} from "@/features/catalog/types/order";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  orderPayload: CreateOrderFull;
}

// 🔹 Usamos el mismo tipo que CreateOrderOptionGroup para evitar duplicación
type MappedOptionGroup = CreateOrderOptionGroup;

export default function SubmitOrderButton({ orderPayload }: Props) {
  const [error, setError] = useState("");
  const { items, getTotal, clearCart } = useCartStore();
  const createOrderMutation = useCreateOrder();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { addAlert } = useAlert();

  const handleSubmitOrder = async () => {
    setError("");

    if (!orderPayload.userId || !orderPayload.businessId || !user) {
      setError("Faltan datos para completar la orden.");
      return;
    }

    try {
      const mappedItems: CreateOrderItem[] = items.map((cartItem) => {
        const mappedOptionGroups: CreateOrderOptionGroup[] =
          cartItem.selectedOptions
            ? Object.values(
                cartItem.selectedOptions.reduce((acc, selectedOpt) => {
                  let originalOption;
                  let originalGroup;

                  for (const group of cartItem.product.optionGroups) {
                    originalOption = group.options.find(
                      (opt) => opt.id === selectedOpt.id
                    );
                    if (originalOption) {
                      originalGroup = group;
                      break;
                    }
                  }

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

                    acc[originalGroup.id].options.push({
                      optionName: originalOption.name,
                      priceModifierType: originalOption.priceModifierType,
                      quantity: 1,
                      priceFinal: String(originalOption.priceFinal), // ✅ string
                      priceWithoutTaxes: String(
                        originalOption.priceWithoutTaxes
                      ), // ✅ string
                      taxesAmount: String(originalOption.taxesAmount), // ✅ string
                      opcionId: originalOption.id,
                    });
                  }
                  return acc;
                }, {} as Record<string, MappedOptionGroup>)
              )
            : [];

        return {
          menuProductId: cartItem.product.id,
          productName: cartItem.product.name,
          productDescription: cartItem.product.description,
          productImageUrl: cartItem.product.imageUrl || undefined,
          quantity: cartItem.quantity,
          priceAtPurchase: String(
            Number(cartItem.product.finalPrice).toFixed(2)
          ), // ✅ string
          notes: "",
          optionGroups: mappedOptionGroups,
        };
      });

      const payload: CreateOrderFull = {
        ...orderPayload,
        items: mappedItems,
        total: Number(getTotal().toFixed(2)),
      };

      await createOrderMutation.mutateAsync(payload);

      clearCart();
      // router.push(`/orders`);
    } catch (err: unknown) {
      addAlert({
        message: getDisplayErrorMessage(err),
        type: "error",
      });
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
