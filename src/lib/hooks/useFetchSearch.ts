// src/hooks/useFetchSerach.ts
import { fetcSearchBusiness } from "@/features/search/api/searchApi";
import { useSearchCacheSync } from "./useSearchCacheSync";
import { ISearchBusinessParams } from "@/features/search/types/search";

export const useFetchSearch = (currentParams: ISearchBusinessParams) => {
  return useSearchCacheSync({
    currentParams,
    fetchSearch: fetcSearchBusiness,
  });
};