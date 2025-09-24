// src/components/ui/Description.tsx

import React from "react";

interface Props {
  children: React.ReactNode;
  lines?: 2 | 3 | 4;
  className?: string; // <-- Añade esta línea

}

export default function Description({ children, lines = 2, className }: Props) {
  const lineClampClass = `line-clamp-${lines}`;

  return (
    <p className={`mt-1 text-xs md:text-base text-gray-600 max-w-xl ${lineClampClass} ${className}`}>
      {children}
    </p>
  );
}