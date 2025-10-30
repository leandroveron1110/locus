"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useSearchCacheStore } from "@/lib/hooks/useSearchCacheStore";
import { useSearchParams } from "next/navigation";

const schema = z.object({
  q: z.string(),
  openNow: z.boolean().optional(),
});

export type SearchFormValues = z.infer<typeof schema>;

interface Props {
  onSearch: (data: SearchFormValues) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const { getParams } = useSearchCacheStore();
  const searchParams = useSearchParams();

  const defaultQuery = searchParams.get("query") || getParams()?.query || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { q: defaultQuery },
  });

  // 🔄 Si cambia el parámetro en la URL (por back/forward), actualizamos el input
  useEffect(() => {
    const queryFromUrl = searchParams.get("query");
    if (queryFromUrl) {
      setValue("q", queryFromUrl);
    }
  }, [searchParams, setValue]);

  return (
    <form onSubmit={handleSubmit(onSearch)} className="relative w-full">
      <div className="relative">
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* Input principal */}
        <input
          {...register("q")}
          placeholder="Buscar negocios, servicios, etc..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     text-gray-700 placeholder-gray-400 transition-colors"
        />
      </div>

      {errors.q && (
        <p className="text-red-500 text-sm mt-2">{errors.q.message}</p>
      )}
    </form>
  );
}
