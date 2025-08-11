// interfaces/order.ts

export interface CreateOrderOption {
  optionName: string;
  priceModifierType: string;
  quantity: number;
  priceFinal: string;
  priceWithoutTaxes: string;
  taxesAmount: string;
  opcionId?: string;
}

export interface CreateOrderOptionGroup {
  groupName: string;
  minQuantity: number;
  maxQuantity: number;
  quantityType: string;
  opcionGrupoId?: string;
  options: CreateOrderOption[];
}

export interface CreateOrderItem {
  menuProductId: string;
  productName: string;
  productDescription?: string;
  productImageUrl?: string;
  quantity: number;
  priceAtPurchase: string;
  notes?: string;
  optionGroups: CreateOrderOptionGroup[];
}

export interface AddressId {
  id: string;
}

export interface CreateOrderFull {
  userId: string;
  businessId: string;
  deliveryAddress?: AddressId;
  pickupAddress?: AddressId;
  status?: string;
  isTest?: boolean;
  total: number;
  notes?: string;
  items: CreateOrderItem[];
}
