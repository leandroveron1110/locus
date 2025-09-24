// src/features/catalog/components/CatalogMenu.tsx
import React from "react";
import { Menu } from "../types/catlog";
import CatalogSection from "./CatalogSection";
import Title from "@/features/common/ui/Title";

interface Props {
  menu: Menu;
}

export default function CatalogMenu({ menu }: Props) {
  // La lógica de ordenamiento se mantiene aquí y es correcta
  const sortedSections = [...menu.sections].sort((a, b) => a.index - b.index);

  return (
    <section>
      <header className="mb-8">
        {/* Usamos text-xl para móvil y md:text-3xl para escritorio */}
        <Title size="medium" >{menu.name}</Title>
      </header>

      <div className="space-y-12">
        {sortedSections.map((section) => (
          <CatalogSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}