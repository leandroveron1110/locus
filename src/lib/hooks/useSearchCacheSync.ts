// src/lib/hooks/useSearchCacheSync.ts
import { useCallback, useRef, useEffect } from "react";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import {
  ISearchBusiness,
  ISearchBusinessParams,
  SearchResultBusiness,
} from "@/features/search/types/search";
import { useSearchCacheStore } from "./useSearchCacheStore";

export interface SearchSyncOptions {
  /** Parámetros actuales de búsqueda */
  currentParams: ISearchBusinessParams;

  /** Función que obtiene resultados desde la API */
  fetchSearch: (
    params: ISearchBusinessParams
  ) => Promise<{ result: ISearchBusiness; latestTimestamp: string }>;
}

/**
 * Hook que sincroniza los resultados de búsqueda y los guarda en cache.
 * - Si los parámetros cambian → se hace una nueva búsqueda completa.
 * - Si los parámetros son los mismos → se hace una actualización incremental usando `lastSyncTime`.
 * - Si la API devuelve `[]`, significa que no hubo cambios y solo se actualiza el timestamp.
 */
export function useSearchCacheSync({
  currentParams,
  fetchSearch,
}: SearchSyncOptions) {
  const { addAlert } = useAlert();
  const isSyncingRef = useRef(false);

  // Acceso directo al store (sin suscripción)
  const getParams = useSearchCacheStore.getState().getParams;
  const getData = useSearchCacheStore.getState().getData;
  const getLastSyncTime = useSearchCacheStore.getState().getLastSyncTime;
  const setCache = useSearchCacheStore.getState().setCache;

  const syncSearch = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      const lastCachedParams = getParams();
      const lastSyncTime = getLastSyncTime();
      const currentData = getData();

      // 🔍 Determinar si cambió la búsqueda
      const isNewSearch =
        !lastCachedParams ||
        JSON.stringify({ ...lastCachedParams, page: 0, limit: 0 }) !==
          JSON.stringify({ ...currentParams, page: 0, limit: 0 });

          currentParams.page = undefined;
          currentParams.limit = undefined;

      // Si cambió la búsqueda, NO enviamos el lastSyncTime
      const paramsToSend: ISearchBusinessParams = {
        ...currentParams,
        ...(isNewSearch ? {} : { lastSyncTime }),
      };

      console.log(
        `[useSearchCacheSync] Ejecutando búsqueda ${
          isNewSearch ? "completa" : "incremental"
        } con params:`,
        paramsToSend
      );

      const { result: newResult, latestTimestamp } = await fetchSearch(paramsToSend);

      let finalResult: ISearchBusiness;

      if (isNewSearch) {
        // 🔄 Nueva búsqueda → reemplazamos todo
        finalResult = newResult;
      } else {
        // 🧩 Actualización incremental → merge con cache
        if (newResult.data.length > 0 && currentData) {
          const mergedMap = new Map<string, SearchResultBusiness>(
            currentData.data.map((item) => [item.id, item])
          );

          newResult.data.forEach((updated) => mergedMap.set(updated.id, updated));

          finalResult = {
            ...currentData,
            data: Array.from(mergedMap.values()),
          };

          console.log(
            `[useSearchCacheSync] ${newResult.data.length} nuevos locales o actualizados.`
          );
        } else {
          // 🔸 Sin cambios → mantenemos el cache actual
          finalResult = currentData ?? newResult;
          console.log("[useSearchCacheSync] Sin cambios, solo se actualiza timestamp.");
        }
      }

      // ✅ Guardamos en el store el nuevo estado
      setCache(currentParams, finalResult, latestTimestamp);
    } catch (error) {
      console.error("[useSearchCacheSync] Error:", error);
      addAlert({ message: getDisplayErrorMessage(error), type: "error" });
    } finally {
      isSyncingRef.current = false;
    }
  }, [currentParams, fetchSearch, addAlert]);

  // Ejecutar automáticamente una vez al montar
  useEffect(() => {
    void syncSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { syncSearch };
}
