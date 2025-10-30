// src/app/page.tsx
import AppHeader from "@/features/header/components/AppHeader";
import SearchPage from "@/features/search/components/Search";

export default function Home() {
  return (
    <>
      <AppHeader />
      <div className="bg-white min-h-screen bg-gray-100">
        <SearchPage />
      </div>
    </>
  );
}
