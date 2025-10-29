import { NotificationCategory, NotificationPriority } from "@/types/notification";
import { AlertTriangle, CheckCircle, Clock, Flame, Megaphone, Package, ShoppingCart } from "lucide-react";
import { JSX } from "react";

export const CATEGORY_CONFIG: Record<
  NotificationCategory,
  {
    icon: JSX.Element;
    color: string;
    path: string;
  }
> = {
  ORDER: {
    icon: <ShoppingCart size={14} className="text-blue-500" />,
    color: "text-blue-500",
    path: "orders",
  },
  PRODUCT: {
    icon: <Package size={14} className="text-green-500" />,
    color: "text-green-500",
    path: "products",
  },
  PROMOTION: {
    icon: <Megaphone size={14} className="text-pink-500" />,
    color: "text-pink-500",
    path: "promotions",
  },
  SYSTEM: {
    icon: <AlertTriangle size={14} className="text-yellow-500" />,
    color: "text-yellow-500",
    path: "dashboard",
  },
};

// 🌟 Config mejorada de Prioridad: Color de fondo, icono y texto
export const PRIORITY_CONFIG: Record<
  NotificationPriority,
  {
    bg: string;
    text: string;
    icon: JSX.Element;
    label: string; // Etiqueta visible
    order: number; // Para ordenar: 3 (HIGH) > 2 (MEDIUM) > 1 (LOW)
  }
> = {
  HIGH: {
    bg: "bg-red-500",
    text: "text-red-700",
    icon: <Flame size={12} />,
    label: "URGENTE",
    order: 3,
  },
  MEDIUM: {
    bg: "bg-amber-400",
    text: "text-amber-700",
    icon: <Clock size={12} />,
    label: "Importante",
    order: 2,
  },
  LOW: {
    bg: "bg-gray-300",
    text: "text-gray-700",
    icon: <CheckCircle size={12} />,
    label: "Info",
    order: 1,
  },
};