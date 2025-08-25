import { CreateOrderFull, CreateOrderItem } from "../types/order";
import { useCartStore } from "./useCartStore";

interface MapCartOptions {
  userId: string;
  businessId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerObservations?: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessObservations?: string;
  deliveryAddressId?: string;
  pickupAddressId?: string;
  notes?: string;
  paymentType?: "CASH" | "TRANSFER" | "DELIVERY";
  paymentInstructions?: string;
  paymentHolderName?: string;
}

export function mapCartToOrderPayload(
  options: MapCartOptions
): CreateOrderFull {
  const { items, getTotal } = useCartStore.getState();

  const mappedItems: CreateOrderItem[] = items.map((cartItem) => ({
    menuProductId: cartItem.product.id,
    productName: cartItem.product.name,
    productDescription: cartItem.product.description,
    productImageUrl: cartItem.product.imageUrl || undefined,
    quantity: cartItem.quantity,
    priceAtPurchase: Number(cartItem.product.finalPrice).toFixed(2), // string decimal
    notes: "",
    optionGroups: cartItem.product.optionGroups.map((group) => ({
      groupName: group.name,
      minQuantity: group.minQuantity,
      maxQuantity: group.maxQuantity,
      quantityType: group.quantityType,
      opcionGrupoId: group.id,
      options: group.options.map((opt) => ({
        optionName: opt.name,
        priceModifierType: opt.priceModifierType,
        quantity: 1, // default 1, se puede ajustar si hay selección
        priceFinal: opt.priceFinal,
        priceWithoutTaxes: opt.priceWithoutTaxes,
        taxesAmount: opt.taxesAmount,
        opcionId: opt.id,
      })),
    })),
  }));

  const order: CreateOrderFull = {
    userId: options.userId,
    businessId: options.businessId,
    customerName: options.customerName,
    customerPhone: options.customerPhone,
    customerAddress: options.customerAddress,
    customerObservations: options.customerObservations,

    businessName: options.businessName,
    businessPhone: options.businessPhone,
    businessAddress: options.businessAddress,
    businessObservations: options.businessObservations,

    deliveryAddress: options.deliveryAddressId
      ? { id: options.deliveryAddressId }
      : undefined,
    pickupAddress: options.pickupAddressId
      ? { id: options.pickupAddressId }
      : undefined,

    total: parseFloat(getTotal().toFixed(2)),
    notes: options.notes,
    items: mappedItems,

    paymentType: options.paymentType || "TRANSFER",
    paymentStatus: "PENDING",
    paymentInstructions: options.paymentInstructions,
    paymentHolderName: options.paymentHolderName,
  };

  return order;
}
