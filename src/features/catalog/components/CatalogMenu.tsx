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
    <>
      <div className="mb-8">
        <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">{menu.name.toLocaleUpperCase()}</p>
      </div>

      <div className="space-y-12 p-1">
        {sortedSections.map((section) => (
          <CatalogSectionWrapper
            key={section.id}
            section={section}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        ))}
      </div>
    </>
  );
}