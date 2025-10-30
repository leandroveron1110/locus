// src\features\search\components\Search.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { SearchFormValues } from "@/features/search/components/SearchBar";
import { List, MapPin } from "lucide-react";
import { withSkeleton } from "@/features/common/utils/withSkeleton";
import SearchBarSkeleton from "./skeleton/SearchBarSkeleton";
import SearchBusinessListSkeleton from "./skeleton/SearchBusinessListSkeleton";
import SearchBusinessMapSkeleton from "./skeleton/SearchBusinessMapSkeleton";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import { ISearchBusinessParams } from "@/features/search/types/search";
import { useFetchSearch } from "@/lib/hooks/useFetchSearch";
import { useSearchCacheStore } from "@/lib/hooks/useSearchCacheStore";
import { useRouter } from "next/navigation";

// 🧩 Carga dinámica con Skeletons
const DynamicSearchBar = withSkeleton(
  () => import("@/features/search/components/SearchBar"),
  SearchBarSkeleton
);

const DynamicSearchBusinessList = withSkeleton(
  () => import("./SearchBusinessList"),
  SearchBusinessListSkeleton
);

const DynamicSearchBusinessMap = withSkeleton(
  () => import("./components/SearchBusinessMap"),
  SearchBusinessMapSkeleton
);
interface SearchPageProps {
  initialParams: Partial<ISearchBusinessParams>;
}
export default function SearchPage({ initialParams }: SearchPageProps) {
  const router = useRouter();
  const { addAlert } = useAlert();

  const { getParams, getData } = useSearchCacheStore();
  const cachedParams = getParams();
  const cachedResult = getData();

  const [currentSearchParams, setCurrentSearchParams] =
    useState<ISearchBusinessParams>(() => {
      return {
        query: cachedParams?.query || initialParams.query || "",
        city: cachedParams?.city || initialParams.city || "Concepcion del Uruguay",
        limit: cachedParams?.limit || initialParams.limit || 20,
        page: cachedParams?.page || initialParams.page || 1,
      };
    });

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const { syncSearch } = useFetchSearch(currentSearchParams);

  const [isLoading, setIsLoading] = useState(false);

  // 🔄 Actualiza los parámetros en la URL
  const updateUrlParams = useCallback(
    (params: ISearchBusinessParams) => {
      const queryParams = new URLSearchParams();

      if (params.query) queryParams.set("query", params.query);
      if (params.city) queryParams.set("city", params.city);
      if (params.page) queryParams.set("page", String(params.page));
      if (params.limit) queryParams.set("limit", String(params.limit));

      router.replace(`?${queryParams.toString()}`);
    },
    [router]
  );

  // 🔍 Cuando el usuario realiza una búsqueda
  const handleSearch = (values: SearchFormValues) => {
    const newParams = {
      ...currentSearchParams,
      query: values.q,
      page: 1,
    };
    setCurrentSearchParams(newParams);
    updateUrlParams(newParams);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await syncSearch();
      } catch (err) {
        addAlert({
          message: getDisplayErrorMessage(err),
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentSearchParams, syncSearch, addAlert]);


  const businesses = cachedResult?.data || [];
  const hasResults = businesses.length > 0;

  const renderContent = () => {
    if (isLoading) {
      return viewMode === "list" ? (
        <SearchBusinessListSkeleton />
      ) : (
        <SearchBusinessMapSkeleton />
      );
    }

    if (hasResults) {
      return viewMode === "list" ? (
        <DynamicSearchBusinessList businesses={businesses} />
      ) : (
        <DynamicSearchBusinessMap businesses={businesses} />
      );
    }

    if (
      !isLoading &&
      cachedParams &&
      (cachedParams.query || cachedParams.city)
    ) {
      return (
        <p className="mt-6 text-center text-gray-500 text-lg">
          No se encontraron resultados para los filtros aplicados.
        </p>
      );
    }

    return (
      <p className="mt-6 text-center text-gray-500 text-lg">
        ¡Comienza tu búsqueda!
      </p>
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="pt-6 pb-4 px-2 sm:px-4 text-center">
        <div className="pt-4 pb-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 uppercase">
            ¿Qué te tienta hoy?
          </h1>
          <p className="text-gray-600 mb-4 text-sm sm:text-base max-w-2xl mx-auto">
            Encontrá todos los negocios y emprendimientos de tu ciudad en un
            solo lugar
          </p>
        </div>
      </div>

      {/* 🔍 Buscador + modos de vista */}
      <div className="flex flex-row items-center gap-2 px-2 sm:px-4">
        <div className="flex-grow">
          <DynamicSearchBar onSearch={handleSearch} />
        </div>

        {(hasResults || isLoading) && (
          <div className="flex gap-1 p-1 rounded-full bg-gray-100 flex-shrink-0">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                viewMode === "map"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              <MapPin size={18} />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        )}
      </div>

      {/* 📍 Contenido principal */}
      <div className="mt-3 px-2 sm:px-4">{renderContent()}</div>
    </div>
  );
}
