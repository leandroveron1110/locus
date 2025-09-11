"use client";

import { useState } from "react";
import { useGallery } from "../../hooks/useGallery";
import { SkeletonGallery } from "./Skeleton/SkeletonGallery";
import { ImageOff, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  businessId: string;
}

export default function Gallery({ businessId }: Props) {
  const { data, isLoading, isError } = useGallery(businessId);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (isLoading) return <SkeletonGallery />;

  if (isError || !data || data.length === 0)
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-12 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
        <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-400 text-center text-sm sm:text-base">
          Sin imágenes para mostrar
        </p>
      </div>
    );

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const showPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + data.length) % data.length);
  };

  const showNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % data.length);
  };

  return (
    <section className="mt-8">
      {/* Grilla de imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[7rem] sm:auto-rows-[8rem]">
        {data.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => openLightbox(idx)}
            className="relative overflow-hidden rounded-2xl shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Abrir imagen ${idx + 1} de la galería`}
          >
            <img
              src={img.url}
              alt={`Imagen negocio ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes de la galería"
        >
          {/* Cerrar */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-red-500 focus:outline-none"
            aria-label="Cerrar visor de imágenes"
          >
            <X size={32} />
          </button>

          {/* Imagen anterior */}
          <button
            onClick={showPrev}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400 focus:outline-none"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Imagen seleccionada */}
          <img
            src={data[selectedIndex].url}
            alt={`Imagen negocio ${selectedIndex + 1}`}
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            loading="lazy"
          />

          {/* Imagen siguiente */}
          <button
            onClick={showNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400 focus:outline-none"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={40} />
          </button>

          {/* Contador */}
          <p className="text-white mt-4 text-sm select-none">
            Imagen {selectedIndex + 1} de {data.length}
          </p>
        </div>
      )}
    </section>
  );
}
