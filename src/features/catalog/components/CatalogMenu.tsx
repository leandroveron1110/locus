import React from "react";
import { Menu } from "../types/catlog";
import Title from "@/features/common/ui/Title";
import CatalogSection from "./CatalogSection";
import { useIntersection } from "../hooks/useIntersection";

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
        {sortedSections.map((section) => {
          const { ref, isIntersecting } = useIntersection<HTMLDivElement>({
            rootMargin: "100px", // pre-carga antes de que aparezca
          });

          return (
            <div key={section.id} ref={ref}>
              <CatalogSection
                section={section}
                pageSize={DEFAULT_PAGE_SIZE}
                autoLoad={isIntersecting}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

