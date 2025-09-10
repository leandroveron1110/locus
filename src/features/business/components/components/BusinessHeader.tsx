import { Globe } from "lucide-react";
import FollowButton from "./FollowButton"; // ajusta la ruta según tu proyecto

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
  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-start">
      {/* Imagen grande en móvil / lateral en desktop */}
      <div className="w-full sm:w-40 relative flex-shrink-0">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="w-full h-64 sm:h-40 object-cover sm:rounded-3xl shadow-md"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-64 sm:h-40 flex items-center justify-center bg-gray-100 sm:rounded-3xl rounded-b-3xl">
            <Globe className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Overlay en móvil */}
        {/* Overlay en móvil */}
        <div className="absolute inset-0 sm:hidden flex flex-col justify-end bg-gradient-to-t from-black/100 to-transparent p-4">
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

      {/* Texto y botón en desktop */}
      <div className="flex-1 mt-4 sm:mt-0 hidden sm:flex flex-col justify-center px-4">
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
