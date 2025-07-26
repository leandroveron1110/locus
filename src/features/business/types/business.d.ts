// src/features/businesses/types/business.d.ts

import { Status } from "@/features/common/types/status";
import { Image } from "../../../types/global";
import { Category } from "./category";

// Interfaz para el modelo Business (versión LIGERA para listados)
// Contiene solo la información básica necesaria para una tarjeta o lista.
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
  modulesConfig: Record<string, any> | {}; // as the example shows {}

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
}


// NUEVA INTERFAZ: Para los detalles completos de un negocio
// Extiende la interfaz Business y añade los IDs de las relaciones.
// Los objetos completos de estas relaciones se cargarán por separado.
export interface BusinessDetails extends Business {
  fullDescription?: string;
  modulesConfig?: Record<string, any>; // JSON field

  // IDs de las relaciones que se cargarán por separado
  // ownerId: string; // Ya está en Business
  categoryIds?: string[]; // IDs de las categorías asociadas
  galleryImageIds?: string[]; // IDs de las imágenes de galería

  // Los siguientes son arrays de IDs, no los objetos completos
  weeklyScheduleIds?: string[];
  contentModuleIds?: string[];
  menuSectionIds?: string[];
  specialScheduleIds?: string[];
  ratingIds?: string[];
  offeredServiceIds?: string[];
  productIds?: string[];
  eventIds?: string[];
}

// Parámetros de búsqueda y filtrado para negocios
export interface BusinessSearchParams {
  search?: string; // Término de búsqueda por nombre, descripción, etc.
  categoryId?: string; // Filtrar por categoría
  statusId?: string; // Filtrar por estado (ej. "ACTIVE")
  // Añadir más filtros según sea necesario (ubicación, rating, etc.)
  page?: number;
  limit?: number;
}
