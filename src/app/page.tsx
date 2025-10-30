import { Suspense } from "react";
import SearchClient from "@/features/search/components/SearchClient";
import AppHeader from "@/features/header/components/AppHeader"; // Asumo que quieres usarlo

// 🚨 Tipo de parámetros limpios
interface ISearchBusinessParams {
  query: string;
  city: string;
  limit: number;
  page: number;
}

// =========================================================
// 1. SKELETON DE CARGA (Client Side)
// =========================================================

function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-8 p-6 bg-white shadow-xl rounded-3xl">
        <h1 className="h-8 w-64 bg-indigo-200 rounded-lg mx-auto" />
        
        {/* 🔍 Input de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="h-12 bg-gray-200 rounded-xl flex-1" />
          <div className="h-12 w-32 bg-indigo-300 rounded-xl" />
        </div>

        {/* 🏷️ Etiquetas de filtros */}
        <div className="flex flex-wrap gap-3 justify-start mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-100 rounded-full" />
          ))}
        </div>

        {/* 🏪 Resultados simulados */}
        <div className="space-y-6 mt-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl shadow-md p-5 flex gap-5 items-center transition duration-300"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-indigo-300 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// 2. SERVER COMPONENT (page.tsx)
// =========================================================

// export const metadata = {
//   metadataBase: new URL('http://localhost:3002'),
//   title: 'Buscador Principal',
//   description: 'Página de búsqueda con parámetros de URL.',
// };


interface HomePageProps {
  searchParams: {
    query?: string;
    city?: string;
    limit?: string;
    page?: string;
  };
}

// ✅ Server Component (async function sin "use client")
export default async function HomePage({
  searchParams, 
}: HomePageProps) { 

  // 🚀 SOLUCIÓN DEFINITIVA PARA NEXT 15 / TURBOPACK:
  // 1. Convertimos el objeto dinámico searchParams en un objeto plano de JavaScript
  //    mediante la propagación asíncrona dentro de una asignación temporal.
  const resolvedParams = await { ...searchParams };
  
  // 2. Desestructuramos el objeto plano resultante (resolvedParams)
  //    Esto garantiza que los accesos a .query, .city, etc., son puramente síncronos
  //    y no activan el chequeo de APIs dinámicas.
  const { query, city, limit, page } = resolvedParams;

  const initialParams: ISearchBusinessParams = {
    // Usamos las variables desestructuradas que ahora son síncronas y seguras
    query: query || "",
    city: city || "Concepcion del Uruguay",
    limit: limit ? Number(limit) : 20,
    page: page ? Number(page) : 1,
  };
  

  return (
    <>
      <AppHeader /> {/* Descomentado para usar la importación */}
      <div className="bg-white min-h-screen pt-12">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchClient initialParams={initialParams} /> 
        </Suspense>
      </div>
    </>
  );
}
