// src/features/auth/hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore'; // Importa tu store de Zustand
import { register as apiRegister } from '../api/authApi'; // Importa la función de registro de la API
import { RegisterPayload, RegisterResponse } from '../types/auth';
import { useRouter } from 'next/navigation'; // Para la redirección después del registro
import { ApiResult } from '@/lib/apiFetch';
import { ApiError } from '@/types/api';

/**
 * Hook personalizado para manejar la lógica de registro de un nuevo usuario.
 * Utiliza useMutation de React Query para la llamada a la API
 * y actualiza el store de Zustand con el estado de autenticación.
 */
export const useRegister = () => {
  const authStoreRegister = useAuthStore((state) => state.register);
  const router = useRouter();

  return useMutation<ApiResult<RegisterResponse>, ApiError, RegisterPayload>({
    mutationFn: apiRegister,
    onSuccess: (user) => {
      if(user) {
        authStoreRegister(user);
        router.push('/');

      }
    }
  });
};
