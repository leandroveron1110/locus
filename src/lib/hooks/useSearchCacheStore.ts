// src/features/search/store/useSearchCacheStore.ts (CON PERSISTENCIA)

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
// 💡 Importar persist y createJSONStorage
import { persist, createJSONStorage } from "zustand/middleware"; 
import { ISearchBusiness, ISearchBusinessParams } from '@/features/search/types/search';

interface SearchCacheState {
  // Estado
  params: ISearchBusinessParams | null;
  data: ISearchBusiness | null;
  lastSyncTime: string | undefined; 

  // SELECTORES (para acceder al estado fuera de React o en hooks)
  getParams: () => ISearchBusinessParams | null;
  getData: () => ISearchBusiness | null;
  getLastSyncTime: () => string | undefined;

  // ACCIÓN DE ACTUALIZACIÓN
  setCache: (
    params: ISearchBusinessParams, 
    data: ISearchBusiness, 
    latestTimestamp: string
  ) => void;

  // OTRAS ACCIONES
  clearSearch: () => void;
}

// 🔑 Implementación del store envuelto en persist
export const useSearchCacheStore = create<SearchCacheState>()(
  // 1. Envolvemos immer con persist
  persist(
    immer((set, get) => ({
      // --- Estado Inicial ---
      params: null,
      data: null,
      lastSyncTime: undefined,

      // --- SELECTORES ---

      getParams: () => get().params,
      getData: () => get().data,
      getLastSyncTime: () => get().lastSyncTime,

      // --- ACCIÓN DE ACTUALIZACIÓN ---

      setCache: (params, data, latestTimestamp) => {
        set((state) => {
          state.params = params;
          state.data = data;
          state.lastSyncTime = latestTimestamp;
        });
      },

      // --- OTRAS ACCIONES ---

      clearSearch: () =>
        set((state) => {
          state.params = null;
          state.data = null;
          state.lastSyncTime = undefined;
        }),
    })),
    // 2. Configuración de persistencia
    {
      // ⚠️ Clave única para guardar la caché de búsqueda
      name: "search-cache-storage", 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({
        params: state.params,
        data: state.data,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);