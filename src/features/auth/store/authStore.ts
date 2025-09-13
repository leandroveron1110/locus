// src/features/auth/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Para persistir el estado
import {
  LoginResponse,
  RegisterResponse,
  AuthState,
  AuthStore, // <-- Importa la nueva interfaz AuthStore
} from "../types/auth";
import {
  getMe as apiGetMe,
} from "../api/authApi";

// Define el estado inicial de autenticación
// NOTA: initialState ahora solo contiene las propiedades de AuthState
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};


function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Ocurrió un error desconocido.";
}

export const useAuthStore = create<AuthStore>()(
  // <-- CAMBIO CLAVE AQUÍ: create<AuthStore>()
  persist(
    (set) => ({
      ...initialState, // Carga el estado inicial

      /**
       * Inicia sesión de un usuario.
       * @param payload Credenciales del usuario.
       */
      login: async (response: LoginResponse) => {
        set({ isLoading: true, error: null }); // Inicia carga, limpia errores previos
        try {
          // Almacena el token en localStorage (o en cookies si se usa un enfoque diferente)
          localStorage.setItem("authToken", response.accessToken);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response.user; // Devuelve el usuario para uso en el componente
        } catch (error: unknown) {
          set({
            ...initialState,
            isLoading: false,
            error: getErrorMessage(error) || "Error al iniciar sesión.",
          });
          throw error; // 👈 dejamos que el componente decida qué hacer
        }
      },

      /**
       * Registra un nuevo usuario.
       * @param payload Datos del nuevo usuario.
       */
      register: async (response: RegisterResponse) => {
        set({ isLoading: true, error: null });
        try {
          localStorage.setItem("authToken", response.accessToken);
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response.user;
        } catch (error: unknown) {
          console.error("Register failed:", error);
          set({
            ...initialState,
            isLoading: false,
            error: getErrorMessage(error) || "Error al registrar usuario.",
          });
          throw error;
        }
      },

      /**
       * Cierra la sesión del usuario.
       */
      logout: () => {
        localStorage.removeItem("authToken"); // Elimina el token del almacenamiento
        set({ ...initialState, isLoading: false }); // Resetea el store a su estado inicial no cargando
      },

      /**
       * Verifica la sesión del usuario al cargar la aplicación.
       * Intenta obtener los datos del usuario usando el token existente.
       */
      checkAuth: async () => {
        set({ isLoading: true, error: null });
        const token = localStorage.getItem("authToken");
        if (!token) {
          set({ ...initialState, isLoading: false }); // No hay token, no autenticado
          return;
        }

        // Si hay un token, intenta obtener los datos del usuario
        try {
          const user = await apiGetMe(); // Usa la función de la API para obtener el perfil
          if(user) {
            set({
              user: user,
              token: token, // Mantiene el token que ya teníamos
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: unknown) {
          localStorage.removeItem("authToken");
          set({
            ...initialState,
            isLoading: false,
            error: "Sesión expirada o inválida.",
          });
        }
      },
    }),
    {
      name: "auth-storage", // Nombre para el item en localStorage
      storage: createJSONStorage(() => localStorage), // Usa localStorage
      // partialize ahora solo necesita definir qué propiedades del estado (NO ACCIONES)
      // deben ser persistidas. Las acciones no se persisten.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // El token se maneja a través de localStorage.setItem/getItem en las acciones,
        // y se reestablece en el store a través de checkAuth.
        // No es necesario que 'persist' lo maneje directamente aquí si ya lo haces manualmente.
        // Si quieres que 'persist' lo maneje, asegúrate de que el tipo 'token' sea compatible.
        // Para simplificar y evitar problemas de serialización/deserialización con null,
        // lo dejamos fuera del partialize, confiando en checkAuth.
      }),
      // Para depuración, si quieres ver qué se guarda, puedes usar:
      // getStorage: () => localStorage,
      // serialize: (state) => JSON.stringify(state),
      // deserialize: (str) => JSON.parse(str),
    }
  )
);
