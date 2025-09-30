// src/features/business/hooks/useUnfollowMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/api";
import { BusinessFollow } from "../types/business";
import { apiDelete, ApiResult } from "@/lib/apiFetch";
import { handleApiError } from "@/features/common/utils/handleApiError";
import { ApiError } from "@/types/api";

interface UnfollowParams {
  userId: string;
  businessId: string;
}

const unfollowBusiness = async ({ userId, businessId }: UnfollowParams): Promise<ApiResult<void>> => {
  try {
    const res = await apiDelete<void>(`/follow/unfollow/${userId}/${businessId}`);
    return res;
    
  } catch (error: unknown) {
    throw handleApiError(error, "Error al desuscribirte")
  }
};

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResult<void>, ApiError, UnfollowParams>({
    mutationFn: unfollowBusiness,
    onSuccess: (_, { businessId }) => {
      queryClient.setQueryData<BusinessFollow>(
        ["business-follow", businessId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            count: oldData.count - 1,
            isFollowing: false,
          };
        }
      );
    }
  });
};
