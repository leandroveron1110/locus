// src/app/page.tsx
import AppHeader from "@/features/header/components/AppHeader";
import SearchPage from "@/features/search/components/Search";

export default function Home() {
  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-100">
        <main className="px-4 py-8 lg:p-8">
          <div className="bg-white rounded-xl shadow-lg sm:p-8">
            {/* Contenedor de la barra de búsqueda */}
              <SearchPage />
            
          </div>
        </main>
      </div>
    </>
  );
}
