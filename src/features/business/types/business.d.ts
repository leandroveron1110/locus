export type BusinessTag = {
  id: string;
  name: string;
};
export type BusinessCategory = {
  id: string;
  name: string;
};

export type BusinessGalery = {
  id: string;
  url: string;
};

export type BusinessWeeklySchedule = Partial<
  Record<
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY",
    string[]
  >
>;

export type BusinessFollow = { isFollowing: boolean; count: number };

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
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  logoUrl?: string;
  modulesConfig: Record<string, any> | {}; // puede ser objeto vacío

  latitude?: number | null;
  longitude?: number | null;
  averageRating?: number | null;
  ratingsCount?: number;

  categories?: BusinessCategory[];

  tags?: BusinessTag[];

  gallery?: BusinessGalery[];

  weeklySchedule?: BusinessWeeklySchedule;

  follow: BusinessFollow;
}
