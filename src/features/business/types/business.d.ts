export interface Business {
  id: string;
  ownerId: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  address: string;
  phone: string;
  whatsapp: string;
  email?: string;
  statusId?: string;
  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  logoUrl?: string;
  modulesConfig: Record<string, any> | {}; // puede ser objeto vacío

  latitude?: number | null;
  longitude?: number | null;
  averageRating?: number | null;
  ratingsCount?: number;

  categories?: Array<{
    id: string;
    name: string;
  }>;

  tags?: Array<{
    id: string;
    name: string;
  }>;

  gallery?: Array<{
    id: string;
    url: string;
  }>;

  weeklySchedule?: Partial<Record<
    'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
    string[]
  >>;
}
