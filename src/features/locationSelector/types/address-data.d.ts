// src/types/address.ts
export interface AddressData {
  street: string;
  number?: string | null;
  city: string;
  province: string;
  country: string;
  postalCode?: string | null;
  latitude: number;
  longitude: number;
  notes?: string | null;
  apartment?: string | null;
}

export interface CreateAddress {
  street: string;
  number?: string;
  apartment?: string;
  city: string;
  province: string;
  country?: string; // por defecto "Argentina"
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  isDefault?: boolean;
  userId?: string; // uuid
}

export interface FullAddress extends CreateAddress {
  id: string;
}
