// src/features/business/hooks/useFollowMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/api";
import { Business } from "../types/business";

interface FollowParams {
  userId: string;
  businessId: string;
}

const followBusiness = async ({ userId, businessId }: FollowParams) => {
  const res = await axios.post(`/follow/${userId}/${businessId}`);
  return res.data;
};

export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followBusiness,
    onSuccess: (_, { businessId }) => {
      queryClient.setQueryData<Business>(
        ["business-profile", businessId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            follow: {
              ...oldData.follow,
              isFollowing: true,
              count: oldData.follow.count + 1,
            },
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error al seguir el negocio:", error);
    },
  });
};
