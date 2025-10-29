import { useEffect, useRef, useCallback } from "react";
// 💡 Asume la existencia de useAlert y getDisplayErrorMessage
import { useAlert } from "@/features/common/ui/Alert/Alert"; 
import { getDisplayErrorMessage } from "@/lib/uiErrors";

// --- Tipos de Opciones ---

/**
 * Define la estructura de las opciones requeridas para el hook useDataSync.
 * @template T Debe ser un tipo que incluya la propiedad 'id: string'.
 */
export interface SyncOptions<T extends { id: string }> {
  /** ID de la entidad base (por ejemplo, userId, businessId, o un ID fijo como 'globalOrders') */
  id: string | undefined;

  /** Devuelve el último tiempo de sincronización guardado para el ID base. */
  getLastSyncTime: (id: string) => string | undefined;

  /** Devuelve los ítems actuales almacenados en el store. */
  getItems: (id: string) => T[] | undefined;

  /** Actualiza los ítems sincronizados (la lista fusionada) y el nuevo timestamp. */
  setSyncedItems: (id: string, items: T[], latestTimestamp: string) => void;

  /** * Llama a la API correspondiente. 
   * Debe devolver los ítems nuevos/actualizados y el nuevo timestamp del servidor.
   */
  fetchUpdatedItems: (
    id: string,
    lastSyncTime: string | undefined
  ) => Promise<{ items: T[]; latestTimestamp: string }>;

  /** Nombre de la entidad para propósitos de logging (debug). */
  entityName: string;
}

// --- Hook Principal ---

/**
 * Hook personalizado para manejar la sincronización de datos de una entidad específica.
 * Utiliza un patrón de "traer solo los cambios" basado en el último timestamp.
 * * @param options Opciones de sincronización que incluyen getters, setters y la función de la API.
 * @returns Un objeto con la función `syncData` para forzar la sincronización.
 */
export function useDataSync<T extends { id: string }>({
  id,
  getLastSyncTime,
  getItems,
  setSyncedItems,
  fetchUpdatedItems,
  entityName,
}: SyncOptions<T>) {
  // Asume que useAlert está disponible
  const { addAlert } = useAlert(); 
  
  // Referencia para evitar sincronizaciones múltiples simultáneas
  const isSyncingRef = useRef(false);

  // Función principal de sincronización, memoizada con useCallback
  const syncData = useCallback(async () => {
    // 1. Validar y prevenir ejecución doble
    if (!id || isSyncingRef.current) return;
    isSyncingRef.current = true;

    // Obtener el último tiempo de sincronización conocido
    const lastSyncTime = getLastSyncTime(id);
    console.log(`[Sync ${entityName}] Iniciando para ${id} (Último: ${lastSyncTime ?? "N/A"})`);

    try {
      // 2. Llamar a la API para obtener actualizaciones
      const { items: newOrUpdatedItems, latestTimestamp } = await fetchUpdatedItems(id, lastSyncTime);
      
      // Obtener el estado actual del store
      const currentItems = getItems(id) ?? [];

      if (newOrUpdatedItems.length > 0) {
        // 3. Lógica de MERGE: Fusionar ítems actuales con los nuevos/actualizados

        // Crear un mapa con los ítems actuales usando su ID como clave
        const mergedMap = new Map<string, T>(currentItems.map((item) => [item.id, item]));
        
        // Sobrescribir o añadir los ítems nuevos/actualizados en el mapa
        newOrUpdatedItems.forEach((updated) => mergedMap.set(updated.id, updated));

        // Convertir el mapa de nuevo a un array
        const mergedArray = Array.from(mergedMap.values());
        
        // 4. Actualizar el Store con la lista fusionada y el nuevo timestamp
        setSyncedItems(id, mergedArray, latestTimestamp);

        console.log(`[Sync ${entityName}] ${newOrUpdatedItems.length} elementos nuevos/actualizados. Total: ${mergedArray.length}`);
      } else {
        // 5. No hubo cambios: Actualizar SOLO el timestamp
        setSyncedItems(id, currentItems, latestTimestamp);
        console.log(`[Sync ${entityName}] Sin cambios. Timestamp actualizado.`);
      }
    } catch (error) {
      // Manejo de errores
      addAlert({ message: getDisplayErrorMessage(error), type: "error" });
    } finally {
      // Liberar el flag de sincronización
      isSyncingRef.current = false;
    }
  }, [
    id,
    getLastSyncTime,
    getItems,
    setSyncedItems,
    fetchUpdatedItems,
    addAlert,
    entityName,
  ]);

  // Ejecutar la sincronización cuando el 'id' cambie o el hook se monte
  useEffect(() => {
    if (!id) return;
    // Utilizamos 'void' para indicar que no manejaremos la promesa directamente
    void syncData(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Solo se ejecuta al cambiar el ID

  return { syncData };
}