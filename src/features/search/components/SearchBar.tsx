// features/search/components/SearchBar.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";

const schema = z.object({
  q: z.string().min(1, "Escribí algo para buscar"),
  openNow: z.boolean().optional(),
});

export type SearchFormValues = z.infer<typeof schema>;

interface Props {
  onSearch: (data: SearchFormValues) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="bg-white shadow-lg rounded-2xl p-4 border border-gray-100 space-y-4"
    >
      {/* Input principal */}
      <div className="flex items-center gap-2">
        <input
          {...register("q")}
          placeholder="Buscar negocios, servicios, etc..."
          className="flex-grow border border-gray-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      {errors.q && <p className="text-red-500 text-sm">{errors.q.message}</p>}

      {/* Checkbox “Abiertos ahora” */}
      {/* <div className="flex items-center gap-2 text-sm text-gray-700">
        <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
          <input
            type="checkbox"
            {...register("openNow")}
            className="accent-blue-600"
          />
          Abiertos ahora
        </label>
      </div> */}
    </form>
  );
}
