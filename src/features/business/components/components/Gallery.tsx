"use client";

import { useGallery } from "../../hooks/useGallery";


interface Props {
  businessId: string;
}

export default function Gallery({ businessId }: Props) {
  const { data, isLoading, isError } = useGallery(businessId);

  if (isLoading) return <p>Cargando galería...</p>;
  if (isError || !data) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Galería</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={`Imagen negocio`}
            className="w-full h-28 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
