// src/components/ui/Title.tsx

import React from "react";

interface Props {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  className?: string; // <-- Añade esta línea
}

const sizeClasses = {
  small: "text-lg md:text-xl",
  medium: "text-xl md:text-2xl",
  large: "text-2xl md:text-3xl",
};

export default function Title({ children, size = "large",  className }: Props) {
  const selectedSize = sizeClasses[size];

  return (
    <h1 className={`${selectedSize} font-semibold text-gray-900 leading-tight ${className}`}>
      {children}
    </h1>
  );
}