// src/features/business/components/BusinessHeader.tsx
import Image from "next/image";
import { Globe } from "lucide-react";
import FollowButton from "./FollowButton";

interface BusinessHeaderProps {
  logoUrl: string | undefined;
  name: string;
  fullDescription: string;
  businessId: string;
}

export default function BusinessHeader({
  logoUrl,
  name,
  fullDescription,
  businessId,
}: BusinessHeaderProps) {
  const commonClasses = "object-cover shadow-md";

  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-start">
      {/* Contenedor para vista móvil (imagen grande) */}
      <div className="w-full h-64 relative flex-shrink-0 sm:hidden">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            fill
            className={`${commonClasses} rounded-b-3xl`}
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-b-3xl">
            <Globe className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Overlay con texto y botón en móvil */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/100 to-transparent p-4">
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">
            {name}
          </h1>
          {fullDescription && (
            <p className="text-white text-sm mt-1 line-clamp-3 drop-shadow-sm">
              {fullDescription}
            </p>
          )}
          <div className="mt-3">
            <FollowButton businessId={businessId} />
          </div>
        </div>
      </div>

      {/* Contenedor para vista de escritorio (imagen pequeña) */}
      <div className="hidden sm:block sm:w-40 sm:h-40 relative flex-shrink-0">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            fill
            className={`${commonClasses} rounded-3xl`}
            sizes="160px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-3xl">
            <Globe className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Texto y botón en escritorio */}
      <div className="flex-1 mt-4 px-4 hidden sm:flex flex-col justify-center">
        <h1 className="text-3xl font-extrabold text-gray-900 break-words">
          {name}
        </h1>
        {fullDescription && (
          <p className="mt-2 text-gray-600 text-base sm:text-lg max-w-xl line-clamp-3">
            {fullDescription}
          </p>
        )}
        <div className="mt-4 w-max">
          <FollowButton businessId={businessId} />
        </div>
      </div>
    </header>
  );
}