"use client";

import { useEffect, useState } from "react";
import { Star, MessageCircle } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useRating, useSubmitRating } from "../../hooks/useRating";
import { BusinessComments } from "./BusinessComments";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  businessId: string;
}

export default function Rating({ businessId }: Props) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const [showComments, setShowComments] = useState(false);
  const [value, setValue] = useState<number>(0);
  const [comment, setComment] = useState("");

  const {
    data: summary,
    isLoading,
    isError,
    refetch,
    error,
  } = useRating(businessId);

  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

  const { submit, loading } = useSubmitRating({
    businessId,
    userId,
    onSuccess: async () => {
      setComment("");
      setValue(0);
      await refetch();
    },
  });

  const handleSubmit = () => {
    if (value > 0) submit(value, comment);
  };

  return (
    <section className="mt-10 bg-white p-6 rounded-2xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Calificaciones</h2>

      {/* Estado de carga o error */}
      {isLoading && (
        <p className="text-sm text-gray-500">Cargando calificaciones...</p>
      )}
      {isError && (
        <p className="text-sm text-red-500">
          Error al cargar las calificaciones.
        </p>
      )}

      {/* Resumen de calificación */}
      {summary && summary.ratingsCount > 0 ? (
        <div className="flex items-center gap-3 text-yellow-500 font-semibold text-lg">
          <Star size={24} />
          <span>{summary.averageRating.toFixed(1)} / 5</span>
          <span className="text-gray-500 text-base">
            ({summary.ratingsCount} reseñas)
          </span>
        </div>
      ) : (
        !isLoading &&
        !isError && (
          <p className="text-gray-400 text-sm">
            Este negocio aún no tiene calificaciones.
          </p>
        )
      )}

      {/* Formulario para calificar */}
      {userId ? (
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={30}
                onClick={() => setValue(n)}
                className={`cursor-pointer transition ${
                  n <= value
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-300"
                }`}
              />
            ))}
          </div>

          <textarea
            placeholder="Dejá tu comentario (opcional)"
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            disabled={!value || loading}
            onClick={handleSubmit}
            className="bg-yellow-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Calificar"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Iniciá sesión para dejar tu reseña.
        </p>
      )}

      {/* Comentarios */}
      <div>
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          <MessageCircle size={18} />
          {showComments ? "Ocultar comentarios" : "Ver comentarios"}
        </button>

        {showComments && (
          <div className="mt-4">
            <BusinessComments businessId={businessId} currentUserId={userId} />
          </div>
        )}
      </div>
    </section>
  );
}
