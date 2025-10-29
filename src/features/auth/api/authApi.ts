// src/features/auth/api/authApi.ts
import { handleApiError } from '@/features/common/utils/handleApiError';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, User } from '../types/auth';
import { apiGet, apiPost } from '@/lib/apiFetch';
import { ApiResult } from '@/types/api';

/**


/**
 * Function to perform user login.
 * @param payload User's email and password data.
 * @returns A promise that resolves with the login response (user and token).
 * @throws ApiErrorResponse in case of error.
 */
export const login = async (payload: LoginPayload): Promise<ApiResult<LoginResponse>>  => {
  try {
    const response = await apiPost<LoginResponse>('/auth/login/client', payload);
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Unknown error during login');
  }
};

/**
 * Function to register a new user.
 * @param payload New user data (first name, last name, email, password, optional role).
 * @returns A promise that resolves with the registration response (user and token).
 * @throws ApiErrorResponse in case of error.
 */
export const register = async (payload: RegisterPayload): Promise<ApiResult<RegisterResponse>> => {
  try {
    const response = await apiPost<RegisterResponse>('/auth/register', payload);
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Unknown error during registration');
  }
};

/**
 * Function to get authenticated user data (e.g., when the app loads).
 * @returns A promise that resolves with the User object.
 * @throws ApiErrorResponse in case of error.
 */
export const getMe = async (): Promise<ApiResult<User>> => {
  try {
    const response = await apiGet<User>('/auth/me');
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Unknown error getting user data');
  }
};