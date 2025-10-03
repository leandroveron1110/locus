// src/components/CatalogMenu.tsx
import React from "react";
import { Menu } from "../types/catlog";
import Title from "@/features/common/ui/Title";
// Importar el nuevo componente envoltorio
import CatalogSectionWrapper from "./CatalogSectionWrapper"; 

interface Props {
  menu: Menu;
}

export default function CatalogMenu({ menu }: Props) {
  const DEFAULT_PAGE_SIZE = 5;
  const sortedSections = [...menu.sections].sort((a, b) => a.index - b.index);

  return (
    <section>
      <header className="mb-8">
        <Title size="medium">{menu.name}</Title>
      </header>

      <div className="space-y-12">
        {sortedSections.map((section) => (
          // ✅ Llamamos al componente envoltorio aquí
          <CatalogSectionWrapper
            key={section.id}
            section={section}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        ))}
      </div>
    </section>
  );
}