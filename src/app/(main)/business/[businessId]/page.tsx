import BusinessProfile from "@/features/business/components/BusinessProfile";
import AppHeader from "@/features/header/components/AppHeader";

interface BusinessPageProps {
  params: {
    businessId: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-100 w-full">
        <main className="w-full">
          <div className="bg-white w-full sm:p-8">
            {/* Contenido principal del perfil del negocio */}
            <BusinessProfile businessId={params.businessId} />
            {/* Otros componentes que reciban businessId */}
          </div>
        </main>
      </div>
    </>
  );
}
