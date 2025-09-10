// src/components/common/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  onClick?: () => void; // Permite acción personalizada
  label?: string;       // Texto opcional, por defecto "Volver"
  className?: string;   // Para estilos adicionales
}

export default function BackButton({
  onClick,
  label = "Volver",
  className = "",
}: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
