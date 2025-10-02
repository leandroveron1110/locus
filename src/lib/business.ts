// src/lib/business.ts

import { Business } from '@/features/business/types/business';
import { cache } from 'react';

// Esta función se llamará UNA SOLA VEZ, incluso si se invoca
// en generateMetadata y en el componente BusinessPage,
// siempre que reciba el mismo businessId.
export const getBusinessData = cache(async (businessId: string):Promise<Business> => {
  // Lógica real de obtención de datos, por ejemplo:
  const res = await fetch(`https://tu-api.com/businesses/${businessId}`, {
    cache: 'force-cache', // O la configuración de caché que prefieras
  });

  if (!res.ok) {
    throw new Error('Fallo al obtener los datos del negocio');
  }

  const data = await res.json();
  return data;
});