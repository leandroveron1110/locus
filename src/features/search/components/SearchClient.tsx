// src/features/search/components/SearchClient.tsx
"use client";

import { ISearchBusinessParams } from "../types/search";
import SearchPage from "./Search";

interface SearchPageProps {
  initialParams: Partial<ISearchBusinessParams>;
}
export default function SearchClient({initialParams}: SearchPageProps) {
  return <SearchPage initialParams={initialParams} />;
}
