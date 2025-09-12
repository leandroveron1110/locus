import { PaymentMethodType, PaymentStatus, OrderStatus } from '@prisma/client';

export interface CreateOrderOption {
  optionName: string;
  priceModifierType: string;
  quantity: number;
  priceFinal: string;         // número decimal como string
  priceWithoutTaxes: string;  // número decimal como string
  taxesAmount: string;        // número decimal como string
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
  priceAtPurchase: string;   // número decimal como string
  notes?: string;
  optionGroups: CreateOrderOptionGroup[];
}

export interface AddressId {
  id: string;
}

export type DeliveryOption = "PICKUP" | "DELIVERY";

export interface CreateOrderFull {
  userId: string;
  businessId: string;
  deliveryAddressId?: string; // id de la tabla adrress del negocio
  pickupAddressId?: string;
  deliveryCompanyId?: string;

  // --- Snapshot del cliente ---
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerObservations?: string;
  customerAddresslatitude?: number;
  customerAddresslongitude?: number;

  // --- Snapshot del negocio ---
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessObservations?: string;
  businessAddresslatitude: number;
  businessAddresslongitude: number;

  // --- Snapshot de delivery ---
  deliveryCompanyName?: string;
  deliveryCompanyPhone?: string;
  totalDelivery?: number; // máx. 2 decimales

  // --- Pagos ---
  paymentType: PaymentMethodType;
  paymentStatus: PaymentStatus;

  deliveryType: DeliveryOption;
  total: number; // máx. 2 decimales
  notes?: string;

  items: CreateOrderItem[];
}
