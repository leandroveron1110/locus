// src/features/search/components/SearchPage.tsx
"use client";

import { useEffect, useState } from "react";
import { SearchFormValues } from "@/features/search/components/SearchBar";
import { useSearchBusinesses } from "@/features/search/hooks/useSearchBusinesses";
import { List, MapPin } from "lucide-react";

import { withSkeleton } from "@/features/common/utils/withSkeleton";
import SearchBarSkeleton from "./skeleton/SearchBarSkeleton";
import SearchBusinessListSkeleton from "./skeleton/SearchBusinessListSkeleton";
import SearchBusinessMapSkeleton from "./skeleton/SearchBusinessMapSkeleton";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

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

export default function SearchPage() {
  const [params, setParams] = useState<{ query?: string }>({});
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const { data, isLoading, error, isError } = useSearchBusinesses(params);
  const { addAlert } = useAlert();

  // Notificación de error por toast
  useEffect(() => {
    if (isError && error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

  const handleSearch = (values: SearchFormValues) => {
    setParams({ query: values.q });
  };

  const hasResults =  data ?  data?.data?.length > 0 : false;

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
        <DynamicSearchBusinessList businesses={data!.data} />
      ) : (
        <DynamicSearchBusinessMap businesses={data!.data} />
      );
    }

    return (
      <p className="mt-6 text-center text-gray-500 text-lg">
        No se encontraron resultados
      </p>
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Encontrá lo que buscás
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-2 items-center">
        <div className="flex-grow w-full px-4 py-8 lg:p-8">
          <DynamicSearchBar onSearch={handleSearch} />
        </div>

        {(hasResults || isLoading) && (
          <div className="flex gap-2 p-1 rounded-full bg-gray-100">
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${
                viewMode === "map"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              <MapPin size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-1">{renderContent()}</div>
    </div>
  );
}
