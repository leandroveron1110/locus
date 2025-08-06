import React from "react";
import { Menu } from "../types/catlog";
import CatalogSection from "./CatalogSection";

interface Props {
  menu: Menu;
}

export default function CatalogMenu({ menu }: Props) {
  return (
    <section>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
        {menu.name}
      </h2>

      {menu.sections
        .sort((a, b) => a.index - b.index)
        .map((section) => (
          <CatalogSection key={section.id} section={section} />
        ))}
    </section>
  );
}
