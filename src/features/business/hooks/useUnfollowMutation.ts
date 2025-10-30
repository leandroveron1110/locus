// src/features/business/hooks/useUnfollowMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessFollow } from "../types/business";
import { apiDelete } from "@/lib/apiFetch";
import { ApiError, ApiResult } from "@/types/api";
import { handleApiError } from "@/features/common/utils/handleApiError";

interface UnfollowParams {
  userId: string;
  businessId: string;
}

const unfollowBusiness = async ({ userId, businessId }: UnfollowParams): Promise<ApiResult<void>> => {
  try {
    const res = await apiDelete<void>(`/follow/unfollow/${userId}/${businessId}`);
    return res.data;
    
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
