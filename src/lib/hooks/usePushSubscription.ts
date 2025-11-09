// src/hooks/usePushSubscription.ts

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore'; // Ajusta la ruta a tu store
import { subscribeUserToPush } from '@/lib/pushSubscription'; // Ajusta la ruta a la función

/**
 * Custom Hook para gestionar la suscripción a notificaciones Push.
 * Se ejecuta solo en el cliente y solo cuando el usuario está autenticado
 * y el estado de Zustand ha sido hidratado.
 */
export function usePushSubscription() {
    // 1. Seleccionar el estado relevante
    const userId = useAuthStore(state => state.user?.id);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    
    // 2. Usar el estado local para asegurar la ejecución en el cliente
    const [isClient, setIsClient] = useState(false);
    // 3. Usar el estado local para rastrear la hidratación
    const [isHydrated, setIsHydrated] = useState(false);

    // Efecto 1: Verificar que estamos en el cliente
    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- 🟢 EFECTO 2: GESTIONAR LA HIDRATACIÓN ---
    useEffect(() => {
        if (!isClient) return;
        
        // Verifica inmediatamente si ya está hidratado (ej. si se vuelve a montar el componente)
        if (useAuthStore.persist.hasHydrated()) {
            setIsHydrated(true);
            return;
        }

        // Si no está hidratado, nos suscribimos al evento de finalización.
        // La función onFinishHydration() es de un solo disparo y no requiere desuscripción.
        // La almacenamos en una variable para asegurar que React no optimice el callback.
        const handleHydration = () => {
             setIsHydrated(true);
             console.log("✅ Zustand Store hidratado. Listo para la suscripción Push.");
        };
        
        useAuthStore.persist.onFinishHydration(handleHydration);

        // Ya que onFinishHydration solo se dispara una vez y no devuelve un unsub,
        // la limpieza de este efecto no es necesaria.
        
    }, [isClient]); // Solo se ejecuta una vez en el cliente


    // --- 🚀 EFECTO 3: GESTIONAR LA SUSCRIPCIÓN ---
    useEffect(() => {
        // Ejecución solo si:
        // a) Estamos en el cliente (isClient)
        // b) El estado de Zustand ya se ha cargado (isHydrated)
        // c) El usuario está autenticado (isAuthenticated)
        // d) Tenemos un ID de usuario válido (userId)
        
        if (isClient && isHydrated && isAuthenticated && userId) {
            console.log("🚀 usePushSubscription: Intentando suscribir al usuario:", userId);
            // La función interna es la que contiene la lógica de optimización (localStorage)
            subscribeUserToPush(userId);
        }

        // Manejo de limpieza al hacer logout (el userId se vuelve null)
        if (isClient && isHydrated && !isAuthenticated) {
            console.log("🔒 Usuario desconectado. Limpiando bandera de suscripción local.");
            localStorage.removeItem("push_subscription_status");
        }
        
    }, [isClient, isHydrated, isAuthenticated, userId]); 

    return null; 
}