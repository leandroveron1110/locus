"use client";

import { timeAgo } from "@/features/common/utils/timeAgo";
import { useUserNotificationsStore } from "@/lib/hooks/useUserNotificationsStore";
import { INotification, NotificationPriority } from "@/types/notification";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import React from "react";
import { TextWithLineBreaks } from "./components/TextWithLineBreaks";
import {
  CATEGORY_CONFIG,
  PRIORITY_CONFIG,
} from "../../utils/configNotification";
import { useUserNotificationsSocket } from "@/lib/hooks/useUserNotificationsSocket";
import { useFetchUserNotifications } from "../../hooks/useFetchUserNotifications";

interface NotificationsBellProps {
  userId: string;
  isMobileView?: boolean;
}

export function NotificationsBell({
  userId,
  isMobileView = false,
}: NotificationsBellProps) {
  useUserNotificationsSocket(userId);
  useFetchUserNotifications(userId);
  const [isOpen, setIsOpen] = useState(false); // Para el dropdown de escritorio
  const [isModalOpen, setIsModalOpen] = useState(false); // Para el modal móvil
  const { getNotifications } = useUserNotificationsStore();
  const notifications = getNotifications() ?? [];
  const router = useRouter();

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const priorityA =
        PRIORITY_CONFIG[(a.priority ?? "LOW") as NotificationPriority].order;
      const priorityB =
        PRIORITY_CONFIG[(b.priority ?? "LOW") as NotificationPriority].order;

      // 1. Prioridad (descendente: HIGH primero)
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      // 2. Fecha (descendente: más reciente primero)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [notifications]);

  const count = sortedNotifications.length;

  const handleNavigation = () => {
    setIsOpen(false);
    setIsModalOpen(false);
    router.push(`/orders`);
  };

  // Lógica principal para el click en la campana
  const handleBellClick = () => {
    if (isMobileView) {
      // En móvil, abrir el modal
      setIsModalOpen(true);
    } else {
      // En escritorio, abrir/cerrar el dropdown
      setIsOpen((prev) => !prev);
    }
  };

  // Componente de renderizado de un ítem de notificación
  const NotificationItem = (n: INotification) => {
    const priorityKey: NotificationPriority = (n.priority ??
      "LOW") as NotificationPriority;
    const priorityConfig = PRIORITY_CONFIG[priorityKey];
    const config = CATEGORY_CONFIG[n.category] ?? CATEGORY_CONFIG.SYSTEM;

    const priorityBorder =
      priorityKey === "HIGH"
        ? "border-l-4 border-red-500"
        : priorityKey === "MEDIUM"
        ? "border-l-4 border-amber-400"
        : "border-l-4 border-gray-300";

    return (
      <div
        key={n.id}
        onClick={() => handleNavigation()}
        className={`p-3 border-b border-gray-100 hover:bg-gray-50 flex items-start gap-3 cursor-pointer transition-colors ${priorityBorder}`}
      >
        {/* Icono de categoría */}
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Indicador de Prioridad más prominente y tiempo */}
          <div className="flex items-center space-x-2 mb-1">
            <span
              className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase 
                              text-white ${priorityConfig.bg}`}
              title={`Prioridad: ${priorityKey}`}
            >
              {priorityConfig.icon}
              <span className="ml-1">{priorityConfig.label}</span>
            </span>
            <span className={`text-[10px] text-gray-500`}>
              {timeAgo(n.timestamp)}
            </span>
          </div>

          <p
            className={`text-xs ${config.color} font-medium break-words whitespace-normal mb-0.5`}
          >
            <TextWithLineBreaks text={n.title} />
          </p>
          <p className="text-xs text-gray-900 break-words whitespace-normal">
            <TextWithLineBreaks text={n.message} />
          </p>
        </div>
      </div>
    );
  };

  // Función de renderizado de la lista de notificaciones (reutilizable para dropdown y modal)
  const renderNotificationList = (isFullHeight: boolean = false) => (
    <>
      <div
        className={`${
          isFullHeight
            ? "flex-1 overflow-y-auto"
            : "max-h-64 overflow-y-auto scroll-smooth"
        }`}
      >
        {sortedNotifications.length === 0 ? (
          <p className="text-center text-gray-500 text-sm p-4">
            No hay notificaciones nuevas.
          </p>
        ) : (
          sortedNotifications.map(NotificationItem)
        )}
      </div>

      {/* Footer */}
      {sortedNotifications.length > 0 && (
        <div className="p-2 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={() => handleNavigation()}
            className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Ver todas las notificaciones
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="relative">
      <button
        className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
        onClick={handleBellClick}
        aria-label="Abrir notificaciones"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {count > 0 && (
          <span
            className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4
              flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white
              bg-red-600 rounded-full shadow-md"
            aria-hidden
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {isOpen && !isMobileView && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in">
          {/* Header */}
          <div className="p-3 flex justify-between items-center border-b border-gray-100">
            <h5 className="text-sm font-semibold text-gray-800">
              Notificaciones
            </h5>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar notificaciones"
            >
              <X size={16} />
            </button>
          </div>
          {renderNotificationList()}
        </div>
      )}

      {/* 📱 Modal de Pantalla Completa (Móvil) */}
      {isModalOpen && isMobileView && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col animate-fade-in-up">
          {/* Header del Modal */}
          <div className="p-4 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
            <h5 className="text-lg font-semibold text-gray-800">
              Todas las Notificaciones
            </h5>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar notificaciones"
            >
              <X size={24} />
            </button>
          </div>

          {/* Lista de Notificaciones en Modal */}
          <div className="flex-1 overflow-y-auto">
            {renderNotificationList(true)}
          </div>
        </div>
      )}
    </div>
  );
}
