"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { follow, unfollow } from "../api/businessApi";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Star,
  Tag,
  Clock,
} from "lucide-react";
import { useFollowMutation } from "../hooks/useFollowMutation";
import { useUnfollowMutation } from "../hooks/useUnfollowMutation";

interface Props {
  businessId: string;
}

// Días en español para traducir
const daysES: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export default function BusinessProfile({ businessId }: Props) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();

  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  if (isLoading)
    return <p className="text-center text-gray-500 mt-8">Cargando perfil...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-8">
        Error: {(error as Error).message}
      </p>
    );
  if (!data) return null;

  const handleFollowToggle = () => {
    if (!userId) return;
    if (data.follow.isFollowing) {
      unfollowMutation.mutate({ userId, businessId });
    } else {
      followMutation.mutate({ userId, businessId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Card principal */}
      <section className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
        {/* Logo y nombre */}
        <div className="flex items-center gap-8">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt={`${data.name} logo`}
              className="w-32 h-32 rounded-2xl object-cover border border-gray-200 shadow-sm"
            />
          )}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {data.name}
            </h1>
            {data.shortDescription && (
              <p className="text-gray-600 mt-2 text-lg">
                {data.shortDescription}
              </p>
            )}
          </div>
        </div>

        {/* Descripción */}
        {data.fullDescription && (
          <p className="text-gray-700 leading-relaxed">
            {data.fullDescription}
          </p>
        )}

        {/* Seguimiento estilo moderno */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleFollowToggle} // ✅ Esta línea estaba mal antes, no lo estaba llamando
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
              ${
                data.follow.isFollowing
                  ? "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
                  : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              }
            `}
            disabled={isMutating}
          >
            <Star size={18} />
            {isMutating
              ? "Cargando..."
              : data.follow.isFollowing
              ? "Siguiendo"
              : "Seguir"}
          </button>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star size={16} className="text-yellow-500" />
            <span>{data.follow.count}</span>
            <span className="text-gray-400">seguidores</span>
          </div>
        </div>

{typeof data.averageRating === "number" && (
  <section className="mt-8 flex items-center gap-3 text-yellow-500 font-semibold text-lg">
    <Star size={24} />
    <span>{data.averageRating.toFixed(1)} / 5</span>
    <span className="text-gray-500 text-base">
      ({data.ratingsCount ?? 0} reseñas)
    </span>
  </section>
)}


        {/* Contacto */}
        <div className="grid sm:grid-cols-2 gap-6 text-gray-700 text-base">
          <div className="flex items-center gap-3">
            <MapPin className="text-blue-600" size={20} />
            <span>{data.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-green-600" size={20} />
            <span>{data.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-green-500" size={20} />
            <span>{data.whatsapp}</span>
          </div>
          {data.email && (
            <div className="flex items-center gap-3">
              <Mail className="text-red-600" size={20} />
              <span>{data.email}</span>
            </div>
          )}
        </div>

        {/* Redes sociales */}
        <div className="flex items-center gap-6 mt-4 text-gray-600">
          {data.websiteUrl && (
            <a
              href={data.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sitio web"
              className="hover:text-blue-700 transition"
            >
              <Globe size={24} />
            </a>
          )}
          {data.facebookUrl && (
            <a
              href={data.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-800 transition"
            >
              <Facebook size={24} />
            </a>
          )}
          {data.instagramUrl && (
            <a
              href={data.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-600 transition"
            >
              <Instagram size={24} />
            </a>
          )}
        </div>

        {/* Horarios */}
        {data.weeklySchedule && Object.keys(data.weeklySchedule).length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} /> Horarios de atención
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 text-sm">
              {Object.entries(data.weeklySchedule).map(([day, intervals]) => (
                <div
                  key={day}
                  className="bg-blue-50 rounded-lg p-3 flex flex-col items-start shadow-sm"
                >
                  <span className="font-semibold text-blue-700 mb-1">
                    {daysES[day] ?? day}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {intervals.map((interval) => (
                      <span
                        key={interval}
                        className="bg-blue-200 text-blue-900 rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {interval}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categorías y Tags */}
        {(data.categories?.length || data.tags?.length) && (
          <section className="mt-8 space-y-4">
            {data.categories?.length ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Categorías
                </h2>
                <ul className="flex flex-wrap gap-3">
                  {data.categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-2 shadow-sm"
                    >
                      <Tag size={16} /> {cat.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {data.tags?.length ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Tags
                </h2>
                <ul className="flex flex-wrap gap-3">
                  {data.tags.map((tag) => (
                    <li
                      key={tag.id}
                      className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm"
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        )}

        {/* Galería */}
        {data.gallery?.length ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Galería
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.gallery.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={`${data.name} imagen`}
                  className="w-full h-28 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Calificación */}
        {typeof data.averageRating === "number" && (
          <section className="mt-8 flex items-center gap-3 text-yellow-500 font-semibold text-lg">
            <Star size={24} />
            <span>{data.averageRating.toFixed(1)} / 5</span>
            <span className="text-gray-500 text-base">
              ({data.ratingsCount ?? 0} reseñas)
            </span>
          </section>
        )}

        {/* Ubicación */}
        {typeof data.latitude === "number" &&
          typeof data.longitude === "number" && (
            <section className="mt-8 text-gray-600 text-sm">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <MapPin size={20} />
                Ver ubicación en Google Maps
              </a>
            </section>
          )}
      </section>
    </div>
  );
}
