// components/ProfileNav.tsx
"use client";

import { Phone, Clock, Tag, Star, List } from "lucide-react";

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  activeSection: string;
  onChange: (section: string) => void;
  hasMenu: boolean;
}

// Actualiza la lista para incluir el menú como un elemento que se puede filtrar
const sections: Section[] = [
  { id: "schedule", label: "Horarios", icon: <Clock className="h-6 w-6" /> },
  { id: "contact", label: "Contacto", icon: <Phone className="h-6 w-6" /> },
  { id: "menu", label: "Menú", icon: <List className="h-6 w-6" /> },
  { id: "categories", label: "Categorías", icon: <Tag className="h-6 w-6" /> },
  { id: "rating", label: "Calificación", icon: <Star className="h-6 w-6" /> },
  // { id: "gallery", label: "Galería", icon: <ImageIcon className="h-6 w-6" /> },
];

export default function ProfileNav({ activeSection, onChange, hasMenu }: Props) {
  // Filtra las secciones para mostrar u ocultar el menú
  const visibleSections = sections.filter((section) => {
    if (section.id === "menu") {
      return hasMenu;
    }
    return true;
  });

  return (
    <div className="flex justify-around py-4 overflow-x-auto">
      {visibleSections.map((section) => (
        <button
          key={section.id}
          onClick={() => onChange(section.id)}
          className={`flex flex-col items-center gap-1 min-w-[70px] ${
            activeSection === section.id ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full border ${
              activeSection === section.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            {section.icon}
          </div>
          <span className="text-xs font-medium">{section.label}</span>
        </button>
      ))}
    </div>
  );
}