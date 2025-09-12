// src/features/catalog/components/CatalogMenu.tsx
import React from "react";
import { Menu } from "../types/catlog";
import CatalogSection from "./CatalogSection";

interface Props {
  menu: Menu;
}

export default function CatalogMenu({ menu }: Props) {
  // ⬅️ La lógica de ordenamiento se mantiene aquí y es correcta
  const sortedSections = [...menu.sections].sort((a, b) => a.index - b.index);

  return (
    <section> {/* ⬅️ Quitamos las clases de padding */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{menu.name}</h2>
      </header>

      <div className="space-y-12">
        {sortedSections.map((section) => (
          <CatalogSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}
