// src/features/auth/api/authApi.ts
import { handleApiError } from '@/features/common/utils/handleApiError';
import api from '../../../lib/api'; // Import the configured Axios instance
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, User } from '../types/auth';

/**


/**
 * Function to perform user login.
 * @param payload User's email and password data.
 * @returns A promise that resolves with the login response (user and token).
 * @throws ApiErrorResponse in case of error.
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse | undefined>  => {
  try {
    const response = await api.post<LoginResponse>('/auth/login/client', payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, 'Unknown error during login');
  }
};

/**
 * Function to register a new user.
 * @param payload New user data (first name, last name, email, password, optional role).
 * @returns A promise that resolves with the registration response (user and token).
 * @throws ApiErrorResponse in case of error.
 */
export const register = async (payload: RegisterPayload): Promise<RegisterResponse | undefined> => {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', payload);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, 'Unknown error during registration');
  }
};

/**
 * Function to get authenticated user data (e.g., when the app loads).
 * @returns A promise that resolves with the User object.
 * @throws ApiErrorResponse in case of error.
 */
export const getMe = async (): Promise<User | undefined> => {
  try {
    const response = await api.get<User>('/auth/me');
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, 'Unknown error getting user data');
  }
};

// Future functions for:
// - Password recovery
// - User profile update
// - Email verification, etc.
