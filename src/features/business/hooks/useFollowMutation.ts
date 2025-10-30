// src/features/business/hooks/useFollowMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessFollow } from "../types/business";
import { fetchFollowBusinessAddUser } from "../api/businessApi";
import { ApiError, ApiResult } from "@/types/api";

export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResult<BusinessFollow>,
    ApiError,
    {
      userId: string;
      businessId: string;
    }
  >({
    mutationFn: fetchFollowBusinessAddUser,
    onSuccess: (_, { businessId }) => {
      queryClient.setQueryData<BusinessFollow>(
        ["business-follow", businessId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            count: oldData.count + 1,
            isFollowing: true,
          };
        }
      );
    },
  });
};
