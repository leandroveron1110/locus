// features/search/components/SearchBusinessList.tsx
import { SearchResultBusiness } from "../types/search";
import { SearchBusinessCard } from "./SearchBusinessCard";

interface Props {
  businesses: SearchResultBusiness[];
}

export default function SearchBusinessList({ businesses }: Props) {
  if (!businesses || businesses.length === 0) return null;

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {businesses.length} {businesses.length === 1 ? 'negocio' : 'negocios'} encontrados
      </h2>
      <div className="flex flex-wrap justify-center sm:justify-start gap-6">
        {businesses.map((b) => (
          <div key={b.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]">
            <SearchBusinessCard business={b} />
          </div>
        ))}
      </div>
    </>
  );
}