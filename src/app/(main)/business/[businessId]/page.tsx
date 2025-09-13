import BusinessProfile from "@/features/business/components/BusinessProfile";
import AppHeader from "@/features/header/components/AppHeader";

// Page component
export default function BusinessPage({ params }: { params: { businessId: string } }) {
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
