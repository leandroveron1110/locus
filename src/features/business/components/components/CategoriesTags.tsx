// Asumiendo la estructura de data es:
// data: { categories?: { id: string; name: string }[] | null; tags?: { id: string; name: string }[] | null; }

"use client";

import { Tag } from "lucide-react";
import { useCategoriesTags } from "../../hooks/useCategoriesTags";
import { useEffect } from "react";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  businessId: string;
}

export default function CategoriesTags({ businessId }: Props) {
  const { data, isLoading, isError, error } = useCategoriesTags(businessId);

  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error]);

  // 1. Estados de carga y error
  if (isLoading)
    return (
      <p className="text-sm text-gray-500 px-4 sm:px-0 text-center">
        Cargando categorías y tags...
      </p>
    );

  if (isError || !data)
    return (
      <p className="text-sm text-red-500 px-4 sm:px-0 text-center">
        🚨 No se pudieron cargar las categorías y tags.
      </p>
    );

  // 2. Normalizar datos (usar arrays vacíos si son null/undefined)
  const categories = data.categories || [];
  const tags = data.tags || [];

  const noCategories = categories.length === 0;
  const noTags = tags.length === 0;

  // ❌ Se eliminaron los early returns previos (Sin categorías / Sin tags)
  // que impedían mostrar el otro conjunto de datos.

  const renderChips = (items: { id: string; name: string }[]) =>
    items.map((item) => (
      <div
        key={item.id}
        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium shadow-sm hover:bg-gray-200 transition cursor-pointer"
      >
        <Tag size={14} className="text-blue-500" />
        {item.name}
      </div>
    ));

  // 3. Caso: No hay categorías NI tags
  if (noCategories && noTags) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400 space-y-2">
        <Tag size={40} className="text-gray-300" />
        <span className="text-sm font-medium">
          Este negocio aún no tiene categorías ni tags disponibles.
        </span>
      </div>
    );
  }

  // 4. Renderizado: Se muestran ambos (o solo uno) si tienen elementos
  return (
    <section className="mt-6 px-4 sm:px-0 space-y-6">
      {/* Categorías (Solo se renderiza si hay elementos) */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-gray-800 font-semibold mb-2">
            Categorías ({categories.length})
          </h3>
          <div className="flex flex-wrap gap-2">{renderChips(categories)}</div>
        </div>
      )}

      {/* Tags (Solo se renderiza si hay elementos) */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-gray-800 font-semibold mb-2">
            Tags ({tags.length})
          </h3>
          <div className="flex flex-wrap gap-2">{renderChips(tags)}</div>
        </div>
      )}
    </section>
  );
}
