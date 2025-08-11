import React from "react";
import { Menu } from "../types/catlog";
import CatalogSection from "./CatalogSection";

interface Props {
  menu: Menu;
}

export default function CatalogMenu({ menu }: Props) {
  const sortedSections = [...menu.sections].sort((a, b) => a.index - b.index);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
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
