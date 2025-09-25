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
            <div className="mb-6">
              <SearchPage />
            </div>

            {/* Este contenedor podrías usarlo para mostrar los negocios */}
            <div className="mt-8">
              {/* Aquí irían tus componentes de lista de negocios, por ejemplo */}
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Negocios cerca de ti</h2>
              {/* <BusinessesList /> */}
              {/* <MapClientWrapper /> */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}