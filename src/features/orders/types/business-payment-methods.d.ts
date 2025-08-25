export interface BusinessPaymentMethod {
  id: string;
  businessId: string;
  alias: string;
  account: string;
  holderName: string;
  instructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}