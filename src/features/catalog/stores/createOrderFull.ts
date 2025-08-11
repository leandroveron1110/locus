import { CreateOrderFull, CreateOrderItem } from "../types/order";
import { useCartStore } from "./useCartStore";

export function mapCartToOrderPayload(
  userId: string,
  businessId: string,
  deliveryAddress?: string,
  pickupAddress?: string,
  notes?: string
): CreateOrderFull {
  const { items, getTotal } = useCartStore.getState();

  const mappedItems: CreateOrderItem[] = items.map((cartItem) => ({
    menuProductId: cartItem.product.id,
    productName: cartItem.product.name,
    productDescription: cartItem.product.description,
    productImageUrl: cartItem.product.imageUrl || undefined,
    quantity: cartItem.quantity,
    priceAtPurchase: Number(cartItem.product.finalPrice).toFixed(2),
    optionGroups: cartItem.product.optionGroups.map((group) => ({
      groupName: group.name,
      minQuantity: group.minQuantity,
      maxQuantity: group.maxQuantity,
      quantityType: group.quantityType,
      opcionGrupoId: group.id,
      options: group.options.map((opt) => ({
        optionName: opt.name,
        priceModifierType: opt.priceModifierType,
        quantity: 1, // Suponiendo 1 por default, o deberías calcular según selección
        priceFinal: opt.priceFinal,
        priceWithoutTaxes: opt.priceWithoutTaxes,
        taxesAmount: opt.taxesAmount,
        opcionId: opt.id,
      })),
    })),
  }));

  const order: CreateOrderFull = {
    userId,
    businessId,
    deliveryAddress: {id: ""+deliveryAddress},
    pickupAddress: {id: ""+pickupAddress},
    total: parseFloat(getTotal().toFixed(2)),
    notes,
    items: mappedItems,
  };

  return order;
}
