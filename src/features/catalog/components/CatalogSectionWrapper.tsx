// src/components/CatalogSectionWrapper.tsx
import React from "react";
import { Section } from "../types/catlog";
import CatalogSection from "./CatalogSection";
import { useIntersection } from "../hooks/useIntersection";

interface Props {
  section: Section;
  pageSize: number;
}

// Este es un componente de función de React válido.
export default function CatalogSectionWrapper({ section, pageSize }: Props) {
  // ✅ Hook llamado en el nivel superior de un componente de función
  const { ref, isIntersecting } = useIntersection<HTMLDivElement>({
    rootMargin: "100px", // pre-carga antes de que aparezca
  });

  return (
    <div key={section.id} ref={ref}>
      <CatalogSection
        section={section}
        pageSize={pageSize}
        // Pasamos isIntersecting como prop para indicar que debe cargarse
        autoLoad={isIntersecting} 
      />
    </div>
  );
}