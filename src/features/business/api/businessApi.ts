import {
  Business,
  BusinessCategory,
  BusinessFollow,
  BusinessGalery,
  BusinessRating,
  BusinessTag,
  BusinessWeeklySchedule,
  Review,
} from "../types/business";
import { apiDelete, apiGet, apiPost, ApiResult } from "@/lib/apiFetch";
import { handleApiError } from "@/features/common/utils/handleApiError";

const baseUrlBusiness = "/business/";

/**
 * Obtenemos el negocio
 */
export const fetchBusinessesByID = async (
  businessId: string
): Promise<ApiResult<Business>> => {
  try {
    const res = await apiGet<Business>(`${baseUrlBusiness}${businessId}`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener la información del negocio");
  }
};

/**
 * Hace que un usuario siga un negocio.
 */
export const follow = async (
  userId: string,
  businessId: string
): Promise<void> => {
  try {
    await apiPost(`${baseUrlBusiness}${businessId}/follow`, { userId });
  } catch (error: unknown) {
    throw handleApiError(error, "Error al seguir el negocio");
  }
};

/**
 * Hace que un usuario deje de seguir un negocio.
 */
export const unfollow = async (
  userId: string,
  businessId: string
): Promise<void> => {
  try {
    await apiDelete(`${baseUrlBusiness}${businessId}/follow`, {
      data: { userId },
    });
  } catch (error: unknown) {
    throw handleApiError(error, "Error al dejar de seguir el negocio");
  }
};

interface FollowParams {
  userId: string;
  businessId: string;
}

export const fetchFollowBusinessAddUser = async ({
  userId,
  businessId,
}: FollowParams): Promise<ApiResult<BusinessFollow>> => {
  try {
    const res = await apiPost<BusinessFollow>(
      `/follow/${userId}/${businessId}`
    );
    return res;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "Error al registrar el seguimiento del negocio"
    );
  }
};

export const fetchFollowers = async (
  businessId: string,
  userId: string | undefined
): Promise<ApiResult<BusinessFollow>> => {
  try {
    if (!userId) {
      const res = await apiGet<BusinessFollow>(
        `/follow/business/follow/${businessId}`
      );
      return res;
    } else {
      const res = await apiGet<BusinessFollow>(
        `/follow/business/${businessId}/${userId}`
      );
      return res;
    }
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los seguidores del negocio");
  }
};

// Tags
export const fetchBusinessTags = async (
  businessId: string
): Promise<ApiResult<BusinessTag[]>> => {
  try {
    const res = await apiGet<BusinessTag[]>(
      `${baseUrlBusiness}${businessId}/tags/tags`
    );
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los tags del negocio");
  }
};

// Categories
export const fetchBusinessCategories = async (
  businessId: string
): Promise<ApiResult<BusinessCategory[]>> => {
  try {
    const res = await apiGet<BusinessCategory[]>(
      `/business/${businessId}/categories/category`
    );
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener las categorías del negocio");
  }
};

/**
 * Schedule
 */
export const fetchBusinessSchedule = async (
  businessId: string
): Promise<ApiResult<BusinessWeeklySchedule>> => {
  try {
    const res = await apiGet<BusinessWeeklySchedule>(
      `/weekly-schedules/by-business/${businessId}`
    );
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los horarios del negocio");
  }
};

export async function fetchWeeklySchedule(
  businessId: string
): Promise<ApiResult<Record<string, string[]>>> {
  try {
    const data = await apiGet<Record<string, string[]>>(
      `/weekly-schedules/${businessId}`
    );
    return data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "Error al obtener el horario semanal del negocio"
    );
  }
}

/**
 * Galery
 */
export const fetchBusinessGaleryBasic = async (
  businessId: string
): Promise<ApiResult<BusinessGalery[]>> => {
  try {
    const res = await apiGet<BusinessGalery[]>(
      `/business/${businessId}/gallery`
    );
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener la galería del negocio");
  }
};

export const fetchSummary = async (
  businessId: string
): Promise<ApiResult<BusinessRating>> => {
  try {
    const res = await apiGet<BusinessRating>(`/ratings/summary/${businessId}`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "Error al obtener el resumen de calificaciones"
    );
  }
};

export const fetchSummarySudmi = async (
  businessId: string,
  userId: string,
  value: number,
  comment: string
): Promise<ApiResult<BusinessRating>> => {
  try {
    const res = await apiPost<BusinessRating>(`/ratings`, {
      businessId,
      userId,
      value,
      comment,
    });
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al enviar la calificación del negocio");
  }
};

export const fetchCommentsByBusinessId = async (
  businessId: string
): Promise<ApiResult<Review[]>> => {
  try {
    const res = await apiGet<Review[]>(`/ratings/comments/${businessId}`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener los comentarios del negocio");
  }
};
