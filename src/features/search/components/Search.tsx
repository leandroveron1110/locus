"use client";

import { useState } from "react";
import SearchBar, { SearchFormValues } from "@/features/search/components/SearchBar";
import { useSearchBusinesses } from "@/features/search/hooks/useSearchBusinesses";
import SearchBusinessList from "./SearchBusinessList";

export default function SearchPage() {
  const [params, setParams] = useState<{ query?: string }>({});
  const { data, isLoading, error } = useSearchBusinesses(params);

  const handleSearch = (values: SearchFormValues) => {
    setParams({ query: values.q });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
      {/* Título */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Encontrá lo que buscás
      </h1>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Mensajes de estado */}
      {isLoading && (
        <p className="mt-6 text-center text-gray-500 animate-pulse text-lg">🔍 Buscando...</p>
      )}
      {error && (
        <p className="mt-6 text-center text-red-500 text-lg font-medium">Error: {error.message}</p>
      )}
      {!isLoading && !error && data?.data?.length === 0 && (
        <p className="mt-6 text-center text-gray-500 text-lg">No se encontraron resultados</p>
      )}

      {/* Resultados */}
      {data?.data && data.data.length > 0 && (
        <div className="mt-6">
          <SearchBusinessList businesses={data.data} />
        </div>
      )}
    </div>
  );
}
