// src/features/search/components/SearchPage.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar, { SearchFormValues } from "@/features/search/components/SearchBar";
import { useSearchBusinesses } from "@/features/search/hooks/useSearchBusinesses";
import SearchBusinessList from "./SearchBusinessList";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const { data, isLoading, error } = useSearchBusinesses({ query: query || undefined });

  // Optional: You can use a state to track the search and only show results
  // after a search is submitted, but the current approach is fine too.

  const handleSearch = (values: SearchFormValues) => {
    // You can use a URL state management library or implement it manually
    window.location.href = `/search?q=${values.q}`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Encontrá lo que buscás
      </h1>
      
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Título de resultados - solo si hay una búsqueda */}
      {query && !isLoading && (
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
          Resultados para "{query}"
        </h2>
      )}

      {/* Mensajes de estado */}
      {isLoading && (
        <p className="mt-6 text-center text-gray-500 animate-pulse text-lg">🔍 Buscando negocios...</p>
      )}
      {error && (
        <p className="mt-6 text-center text-red-500 text-lg font-medium">
          Hubo un error al buscar: {error.message}
        </p>
      )}
      {!isLoading && !error && data?.data?.length === 0 && (
        <div className="mt-6 text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No se encontraron resultados para <span className="font-bold text-gray-700">"{query}"</span>.
          </p>
          <p className="mt-2 text-gray-400">
            Intenta con otro término o verifica la ortografía.
          </p>
        </div>
      )}

      {/* Resultados */}
      {!isLoading && data?.data && data.data.length > 0 && (
        <div className="mt-6">
          <SearchBusinessList businesses={data.data} />
        </div>
      )}
    </div>
  );
}