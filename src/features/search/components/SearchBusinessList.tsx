"use client";

import { SearchResultBusiness } from "../types/search";
import { SearchBusinessCard } from "./SearchBusinessCard";

interface Props {
  businesses: SearchResultBusiness[];
}

export default function SearchBusinessList({ businesses }: Props) {
  if (!businesses) return null;

  return (
    <section className="max-w-7xl mx-auto  flex flex-col h-[calc(100vh-80px)]">
      <p className="text-sm sm:text-base text-gray-500 mb-4">
        {businesses.length > 0 ? (
          <>
            <span className="font-medium text-gray-700">
              {businesses.length}
            </span>{" "}
            {businesses.length === 1
              ? "negocio encontrado"
              : "negocios encontrados"}
          </>
        ) : (
          "No se encontraron negocios"
        )}
      </p>

      {businesses.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {businesses.map((business) => (
              <SearchBusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-12">
          Prueba buscando otro término o verifica tu ubicación.
        </p>
      )}
    </section>
  );
}
