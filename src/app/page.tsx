// src\app\page.tsx
"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import AppHeader from "@/features/header/components/AppHeader";

// 💀 Skeleton separado y seguro para el build
function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 🔍 Input de búsqueda */}
        <div className="h-10 bg-gray-300 rounded-lg w-3/4 mx-auto" />

        {/* 🏷️ Filtros */}
        <div className="flex gap-3 justify-center mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-300 rounded-full" />
          ))}
        </div>

        {/* 🏪 Resultados simulados */}
        <div className="space-y-4 mt-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center"
            >
              <div className="w-16 h-16 bg-gray-300 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 🧩 Import dinámico sin SSR
const DynamicSearchClient = dynamic(
  () => import("@/features/search/components/SearchClient"),
  {
    ssr: false,
    loading: () => <SearchSkeleton />,
  }
);

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <div className="bg-white min-h-screen bg-gray-100">
        <Suspense fallback={<SearchSkeleton />}>
          <DynamicSearchClient />
        </Suspense>
      </div>
    </>
  );
}
