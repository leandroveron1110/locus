// src/features/business/hooks/useUnfollowMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/api";
import { Business } from "../types/business";

interface UnfollowParams {
  userId: string;
  businessId: string;
}

const unfollowBusiness = async ({ userId, businessId }: UnfollowParams) => {
  const res = await axios.delete(`/follow/unfollow/${userId}/${businessId}`);
  return res.data;
};

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollowBusiness,
    onSuccess: (_, { businessId }) => {
      queryClient.setQueryData<Business>(
        ["business-profile", businessId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            follow: {
              ...oldData.follow,
              isFollowing: false,
              count: oldData.follow.count -1,
            },
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error al dejar de seguir el negocio:", error);
    },
  });
};
