"use client";

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
} from "lucide-react";

interface Props {
  businessId: string;
}

export default function BusinessProfile({ businessId }: Props) {
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);

  if (isLoading)
    return <p className="text-center text-gray-500">Cargando perfil...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">
        Error: {(error as Error).message}
      </p>
    );
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        {/* Logo y nombre */}
        <div className="flex items-center items-start gap-6">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt={`${data.name} logo`}
              className="w-28 h-28 rounded-lg object-cover border"
            />
          )}
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            {data.shortDescription && (
              <p className="text-gray-600 mt-1">{data.shortDescription}</p>
            )}
          </div>
        </div>

        {/* Descripción completa */}
        {data.fullDescription && (
          <div className="text-gray-800 text-sm">
            <p>{data.fullDescription}</p>
          </div>
        )}

        {/* Contacto y ubicación */}
        <div className="grid sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5" size={18} />
            <span>{data.address}</span>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5" size={18} />
            <span>{data.phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5" size={18} />
            <span>{data.whatsapp}</span>
          </div>
          {data.email && (
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5" size={18} />
              <span>{data.email}</span>
            </div>
          )}
        </div>

        {/* Redes sociales */}
        <div className="flex items-center gap-4 text-gray-700">
          {data.websiteUrl && (
            <a
              href={data.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Sitio web"
            >
              <Globe size={20} className="text-blue-600 hover:text-blue-800" />
            </a>
          )}
          {data.facebookUrl && (
            <a
              href={data.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <Facebook
                size={20}
                className="text-blue-700 hover:text-blue-900"
              />
            </a>
          )}
          {data.instagramUrl && (
            <a
              href={data.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <Instagram
                size={20}
                className="text-pink-500 hover:text-pink-700"
              />
            </a>
          )}
        </div>

        {/* Categorías y Tags */}
        {(data.categories?.length || data.tags?.length) && (
          <div>
            {data.categories?.length ? (
              <div className="mb-2">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Categorías:
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {data.categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Tag size={14} /> {cat.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {data.tags?.length ? (
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Tags:</h3>
                <ul className="flex flex-wrap gap-2">
                  {data.tags.map((tag) => (
                    <li
                      key={tag.id}
                      className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}

        {/* Galería de imágenes */}
        {data.gallery?.length ? (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Galería</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.gallery.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={`${data.name} imagen`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Calificación */}
        {typeof data.averageRating === "number" && (
          <div className="pt-4 flex items-center gap-2 text-yellow-600 text-sm font-medium">
            <Star size={18} />
            <span>{data.averageRating.toFixed(1)} / 5</span>
            <span className="text-gray-500">
              ({data.ratingsCount ?? 0} reseñas)
            </span>
          </div>
        )}

        {/* Coordenadas con enlace a Google Maps */}
        {typeof data.latitude === "number" &&
          typeof data.longitude === "number" && (
            <div className="pt-4 text-sm text-gray-600">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <MapPin size={18} />
                <span>
                  Ver ubicación: {data.latitude.toFixed(4)},{" "}
                  {data.longitude.toFixed(4)}
                </span>
              </a>
            </div>
          )}
      </div>
    </div>
  );
}
