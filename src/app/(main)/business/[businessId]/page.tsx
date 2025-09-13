import BusinessProfile from "@/features/business/components/BusinessProfile";
import AppHeader from "@/features/header/components/AppHeader";

// Tipo para los params de la página
interface BusinessPageProps {
  params: {
    businessId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Componente de página
export default async function BusinessPage({ params }: BusinessPageProps) {
  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-100 w-full">
        <main className="w-full">
          <div className="bg-white w-full sm:p-8">
            <BusinessProfile businessId={params.businessId} />
          </div>
        </main>
      </div>
    </>
  );
}
