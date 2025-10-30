// src/features/search/types/search.ts (Actualización de ISearchBusinessParams)

export interface ISearchBusinessParams {
  query?: string;

  // 🌟 CAMBIO: categoryId -> categories (Array de IDs o nombres)
  categories?: string[];

  city?: string;
  province?: string;
  tags?: string[];

  // ⚠️ Nota: Si tu back usa estos, agrégalos al DTO
  latitude?: number;
  longitude?: number;
  radiusKm?: number;

  name?: string;

  minRating?: number;

  // 🌟 CAMBIO: skip -> page
  page?: number;

  // 🌟 CAMBIO: take -> limit
  limit?: number;

  openNow?: boolean;

  // ⚠️ Nota: Si el backend no usa orderBy ni filters, elimínalos de aquí.
  orderBy?:
    | "name:asc"
    | "name:desc"
    | "averageRating:asc"
    | "averageRating:desc"
    | "createdAt:asc"
    | "createdAt:desc";
  filters?: string;

  lastSyncTime?: string;
}

// ... El resto de tus interfaces (ISearchBusiness, SearchResultBusiness)

export interface ISearchBusiness {
  data: SearchResultBusiness[];
  total: number;
  skip: number;
  take: number;
}

export interface SearchResultBusiness {
  id: string;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  description?: string; // Podría ser shortDescription o fullDescription
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  categoryNames?: string[];
  tagNames?: string[];
  averageRating?: number;
  reviewCount?: number;
  status?: string;
  isOpenNow?: boolean;
  followersCount: number;
  // Puedes añadir más campos si los necesitas en la UI de búsqueda
}
