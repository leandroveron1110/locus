// src/lib/pushSubscription.ts (o donde lo tengas)

import { apiGet, apiPost } from "./apiFetch"; // Asume que apiFetch existe

// --- Constantes de Almacenamiento ---
const VAPID_KEY_STORAGE = "push_vapid_public_key";
const SUB_STATUS_STORAGE = "push_subscription_status"; // Almacena { userId: string, subscribed: boolean }

// --- Interfaces ---
interface PushKeyResponse {
    publicKey: string;
}

interface SubscriptionResponse {
    success: boolean;
    message?: string;
}

// --- Función Auxiliar ---
const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

/**
 * Gestiona el registro del Service Worker y la suscripción a las notificaciones Push.
 * Implementa cache de clave VAPID y estado de suscripción en el navegador.
 * @param userId - El ID del usuario actual (string).
 */
export async function subscribeUserToPush(userId: string | undefined) {
    if (!userId) {
        // En este punto, el hook ya debería haber validado esto, pero por robustez:
        console.warn("Suscripción Push omitida: userId no proporcionado.");
        return;
    }

    // 2. Comprobar el soporte
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Este navegador no soporta Service Workers o Push Notifications.");
        return;
    }

    try {
        // 3. Manejo del estado de permisos
        let permission = Notification.permission;

        if (permission === "denied") {
            console.error("El usuario ha denegado las notificaciones. No se puede continuar.");
            return;
        }

        if (permission !== "granted") {
            permission = await Notification.requestPermission();
            if (permission !== "granted") {
                console.error("Permiso de notificación denegado o no concedido.");
                return;
            }
        }

        // --- 🟢 OPTIMIZACIÓN 1: VERIFICAR ESTADO DE SUSCRIPCIÓN EN LOCALSTORAGE ---
        const storedStatus = localStorage.getItem(SUB_STATUS_STORAGE);
        if (storedStatus) {
            try {
                const status = JSON.parse(storedStatus);
                // Si ya está suscrito y es el mismo usuario, SALIMOS.
                if (status.subscribed && status.userId === userId) {
                    console.log("✅ Suscripción Push ya registrada en LocalStorage para este usuario. Omitiendo llamadas a la API.");
                    return;
                }
            } catch {
                console.error("Error al parsear el estado de suscripción de localStorage. Limpiando...");
                localStorage.removeItem(SUB_STATUS_STORAGE);
            }
        }

        // --- 🟢 OPTIMIZACIÓN 2: Obtener la clave pública VAPID (con sessionStorage) ---
        let VAPID_PUBLIC_KEY = sessionStorage.getItem(VAPID_KEY_STORAGE);

        if (!VAPID_PUBLIC_KEY) {
            console.log("🔑 Obteniendo clave VAPID de la API.");
            const keyResponse = await apiGet<PushKeyResponse>("/push/key");
            VAPID_PUBLIC_KEY = keyResponse.data?.publicKey ? keyResponse.data?.publicKey : null;

            if (!VAPID_PUBLIC_KEY) {
                console.error("No se pudo obtener la clave VAPID del servidor.");
                return;
            }
            sessionStorage.setItem(VAPID_KEY_STORAGE, VAPID_PUBLIC_KEY); // Guardar para la sesión
        } else {
            console.log("🔑 Clave VAPID recuperada de sessionStorage.");
        }


        // 5. Registrar el Service Worker
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        
        // 6. Obtener o crear la suscripción en el navegador
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey,
            });
            console.log("Nueva suscripción creada.");
        } else {
            console.log("Suscripción existente encontrada. Verificando/Actualizando en el backend.");
        }

        const subscriptionJSON = subscription.toJSON();

        // 7. Enviar/Actualizar la suscripción al backend
        const subscriptionDataToSend = {
            endpoint: subscriptionJSON.endpoint,
            keys: subscriptionJSON.keys,
            targetEntityIds: [userId],
            targetEntityType: "USER",
        };

        const postResponse = await apiPost<SubscriptionResponse>(
            "/push/subscribe",
            subscriptionDataToSend
        );

        if (postResponse.success) {
            console.log("Usuario suscrito/actualizado al Push con éxito.");

            // ✅ CRUCIAL: Guardar el estado de éxito en localStorage
            localStorage.setItem(
                SUB_STATUS_STORAGE,
                JSON.stringify({ userId, subscribed: true })
            );
        } else {
            console.error("El servidor falló al guardar la suscripción. Respuesta:", postResponse);
            localStorage.removeItem(SUB_STATUS_STORAGE);
        }
    } catch (error) {
        console.error("Fallo grave en el proceso de suscripción Push:", error);
        localStorage.removeItem(SUB_STATUS_STORAGE);
    }
}