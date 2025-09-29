
export interface MenuProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface MenuSection {
  id: string;
  name: string;
  products: MenuProduct[];
}

export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
}

export interface BusinessResponse {
  business: Business;
  menu: { sections: MenuSection[] };
}
