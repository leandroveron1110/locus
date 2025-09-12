import BusinessProfile from "@/features/business/components/BusinessProfile";
import AppHeader from "@/features/header/components/AppHeader";

interface Props {
  params: {
    businessId: string;
  };
}

export default async function BusinessPage({ params }: Props) {
  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-100 w-full ">
        <main className="w-full">
          <div className="bg-white w-full sm:p-8">
            {/* The main content for the business profile */}
            <BusinessProfile businessId={params.businessId} />
            {/* You can add more components here that receive businessId */}
          </div>
        </main>
      </div>
    </>
  );
}