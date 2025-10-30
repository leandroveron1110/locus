// src/features/search/store/useSearchCacheStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ISearchBusiness, ISearchBusinessParams } from '@/features/search/types/search';

interface SearchCacheState {
  // Estado
  params: ISearchBusinessParams | null;
  data: ISearchBusiness | null;
  lastSyncTime: string | undefined; // Para el control de la API

  // SELECTORES (para acceder al estado fuera de React o en hooks)
  getParams: () => ISearchBusinessParams | null;
  getData: () => ISearchBusiness | null;
  getLastSyncTime: () => string | undefined;

  // ACCIÓN DE ACTUALIZACIÓN (Usada internamente por el hook de sincronización)
  setCache: (
    params: ISearchBusinessParams, 
    data: ISearchBusiness, 
    latestTimestamp: string
  ) => void;

  // OTRAS ACCIONES
  clearSearch: () => void;
}

export const useSearchCacheStore = create<SearchCacheState>()(
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
);