"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Store,
  ShoppingBag,
  Menu as MenuIconLucide,
  X,
  User,
} from "lucide-react";
import svg from "../../../../public/locus_isotipo.svg";
import { useAuthStore } from "@/features/auth/store/authStore";
import { NotificationsBell } from "./Notification/NotificationsBell";


export default function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logo = svg.src;

  const checkIsActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-white shadow sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
        {/* 🔹 IZQUIERDA: Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
          <img src={logo} alt="Locus Logo" className="h-8 w-auto" />
        </Link>

        {/* 🔸 CENTRO: Navegación principal (solo escritorio) */}
        <nav className="hidden md:flex gap-8">
          <Link
            href="/"
            className={`flex flex-col items-center text-sm font-medium ${
              checkIsActive("/")
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Store size={22} />
            <span>Negocios</span>
          </Link>

          {user && (
            <Link
              href="/orders"
              className={`flex flex-col items-center text-sm font-medium ${
                checkIsActive("/orders")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ShoppingBag size={22} />
              <span>Órdenes</span>
            </Link>
          )}
        </nav>

        {/* 🔹 DERECHA: Componentes dinámicos */}
        <div className="flex items-center gap-3">
          {user && (
            // Uso en ESCRITORIO: Permite el dropdown (visible solo en md:arriba)
            <div className="hidden md:block">
              <NotificationsBell userId={user.id || "default"} isMobileView={false} />
            </div>
          )}

          {/* Perfil (solo escritorio) */}
          {user ? (
            <Link
              href="/profile"
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <User size={26} />
              <span className="font-medium text-sm">Perfil</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <User size={26} />
              <span className="font-medium text-sm">Iniciar sesión</span>
            </Link>
          )}

          {/* 🍔 Menú móvil toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú móvil"
          >
            {mobileMenuOpen ? <X size={28} /> : <MenuIconLucide size={28} />}
          </button>
        </div>
      </div>

      {/* 📱 Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 
            z-40 max-h-[80vh] overflow-y-auto animate-fade-in"
        >
          <ul className="flex flex-col gap-4 p-4">
            <li>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 text-base font-medium ${
                  checkIsActive("/")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Store size={20} />
                Negocios
              </Link>
            </li>

            {user && (
              <li>
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-base font-medium ${
                    checkIsActive("/orders")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <ShoppingBag size={20} />
                  Órdenes
                </Link>
              </li>
            )}

            {/* 🔔 Notificaciones dentro del menú móvil */}
            {user && (
              <li>
                <div 
                  className="flex items-center gap-3"
                  // Nota: Aquí envolvemos NotificationsBell y el texto en un div
                  // ya que NotificationsBell es un componente de botón con su propia lógica.
                  // Su click ahora navegará (gracias a isMobileView={true}).
                >
                  <NotificationsBell
                    userId={user.id || "default"}
                    isMobileView={true} // <-- Marcamos como vista móvil para desactivar el dropdown
                  />
                  <span className="text-base font-medium text-gray-600">
                    Notificaciones
                  </span>
                </div>
              </li>
            )}

            {/* 👤 Perfil/Login */}
            <li className="pt-2 border-t border-gray-200">
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-base font-medium text-gray-600 hover:text-gray-800"
                >
                  <User size={20} />
                  Perfil
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-base font-medium text-gray-600 hover:text-gray-800"
                >
                  <User size={20} />
                  Iniciar sesión
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}