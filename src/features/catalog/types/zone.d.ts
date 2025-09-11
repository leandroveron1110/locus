export interface PriceZone {
  price: number | null;
  message: string;
}

export interface CompanyDelivery {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  phone: string;
}
