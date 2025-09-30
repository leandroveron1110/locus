// src/features/business/components/FollowButton.tsx
"use client";

import { Loader2, Heart } from "lucide-react";
import { useFollowMutation } from "../../hooks/useFollowMutation";
import { useUnfollowMutation } from "../../hooks/useUnfollowMutation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useFollowInfo } from "../../hooks/useFollowInfo";
import { SkeletonFollowButton } from "./Skeleton/SkeletonFollowButton";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { useEffect } from "react";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  businessId: string;
}

export default function FollowButton({ businessId }: Props) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const { addAlert } = useAlert();
  const { data, isLoading, isError, error } = useFollowInfo(businessId);

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();
  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  const handleFollowToggle = () => {
    try {
      if (!userId || !data) return;
      if (data.isFollowing) {
        unfollowMutation.mutate({ userId, businessId });
      } else {
        followMutation.mutate({ userId, businessId });
      }
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  };

  if (isLoading) return <SkeletonFollowButton />;
  if (isError || !data) return null;

  const buttonText = isMutating
    ? "Cargando..." // ⬅️ Nuevo texto para el estado de carga
    : data.isFollowing
    ? "Siguiendo"
    : "Seguir negocio";

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      {/* Botón seguir */}
      <button
        onClick={handleFollowToggle}
        disabled={isMutating}
        aria-pressed={data.isFollowing}
        aria-label={
          data.isFollowing ? "Dejar de seguir negocio" : "Seguir negocio"
        }
        className={`
          flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold
          transition-all duration-200 ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${
            data.isFollowing
              ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100"
              : "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:brightness-110"
          }
        `}
      >
        {isMutating ? (
          <Loader2 className="animate-spin h-4 w-4 text-current" />
        ) : (
          <Heart
            size={16}
            className={`transition-colors duration-200 ${
              data.isFollowing
                ? "text-red-500"
                : "text-white group-hover:text-red-400"
            }`}
            fill={data.isFollowing ? "currentColor" : "none"}
            strokeWidth={2}
          />
        )}
        {buttonText}
      </button>
    </div>
  );
}
