"use client";

import { Star } from "lucide-react";
import { useFollowMutation } from "../../hooks/useFollowMutation";
import { useUnfollowMutation } from "../../hooks/useUnfollowMutation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useFollowInfo } from "../../hooks/useFollowInfo";

interface Props {
  businessId: string;
}

export default function FollowButton({ businessId }: Props) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;

  const { data, isLoading, isError } = useFollowInfo(businessId);

  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();

  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  const handleFollowToggle = () => {
    if (!userId || !data) return;

    if (data.isFollowing) {
      unfollowMutation.mutate({ userId, businessId });
    } else {
      followMutation.mutate({ userId, businessId });
    }
  };

  if (isLoading) {
    return <p className="text-gray-500 text-sm mt-4">Cargando seguidores...</p>;
  }

  if (isError || !data) return null;

  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={handleFollowToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
              ${
                data.isFollowing
                  ? "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
                  : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              }
            `}
        disabled={isMutating}
      >
        <Star size={18} />
        {isMutating ? "Cargando..." : data.isFollowing ? "Siguiendo" : "Seguir"}
      </button>

      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Star size={16} className="text-yellow-500" />
        <span>{data.count}</span>
        <span className="text-gray-400">seguidores</span>
      </div>
    </div>
  );
}
