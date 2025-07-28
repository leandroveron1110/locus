"use client";

import { Tag } from "lucide-react";
import { useCategoriesTags } from "../../hooks/useCategoriesTags";

interface Props {
  businessId: string;
}

export default function CategoriesTags({ businessId }: Props) {
  const { data, isLoading, isError } = useCategoriesTags(businessId);

  if (isLoading) return <p>Cargando categorías y tags...</p>;
  if (isError || !data) return null;

  return (
    <section className="mt-8 space-y-4">
      {data.categories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Categorías</h2>
          <ul className="flex flex-wrap gap-3">
            {data.categories.map((cat) => (
              <li
                key={cat.id}
                className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-2 shadow-sm"
              >
                <Tag size={16} /> {cat.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.tags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Tags</h2>
          <ul className="flex flex-wrap gap-3">
            {data.tags.map((tag) => (
              <li
                key={tag.id}
                className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm"
              >
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
