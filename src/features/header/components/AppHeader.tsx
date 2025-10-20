"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Store,
  Menu as MenuIconLucide,
  X,
  LucideProps,
  User,
} from "lucide-react";
import React, { useState } from "react";
import svg from "../../../../public/favicon.svg";
import { useAuthStore } from "@/features/auth/store/authStore";

interface ILinks {
  href: (businessId: string) => string;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export default function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Solo "Negocios" siempre está, "Órdenes" solo si hay user
  const links: ILinks[] = [
    { href: () => `/`, label: "Negocios", icon: Store },
    ...(user
      ? [{ href: () => `/orders`, label: "Órdenes", icon: ShoppingBag }]
      : []),
  ];

  const checkIsActive = (linkHref: string) => {
    if (linkHref === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(linkHref);
  };

  const logo = svg.src

  return (
    <header className="bg-white shadow sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
        {/* Izquierda: Menú móvil + logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú móvil"
          >
            {mobileMenuOpen ? <X size={28} /> : <MenuIconLucide size={28} />}
          </button>

          <Link href="/" className="flex-shrink-0">
            <img src={logo} alt="Locus Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Navegación escritorio */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-10">
            {links.map((link) => {
              const linkHref = link.href("");
              const isActive = checkIsActive(linkHref);

              return (
                <li key={linkHref}>
                  <Link
                    href={linkHref}
                    className={`flex flex-col items-center justify-center gap-1
                      text-sm font-medium transition-colors duration-200 group
                      ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <link.icon
                      size={24}
                      strokeWidth={isActive ? 2 : 1.5}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Perfil o login */}
        {user ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <User size={28} />
            <span className="hidden sm:block font-medium text-sm">Perfil</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <User size={28} />
            <span className="hidden sm:block font-medium text-sm">
              Iniciar sesión
            </span>
          </Link>
        )}
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 
            bg-white shadow-lg border-t border-gray-200 
            z-40 max-h-[80vh] overflow-y-auto"
        >
          <ul className="flex flex-col gap-4 p-4">
            {links.map((link) => {
              const linkHref = link.href("");
              const isActive = checkIsActive(linkHref);

              return (
                <li key={linkHref}>
                  <Link
                    href={linkHref}
                    className={`flex items-center gap-3 text-base font-medium
                      ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon size={20} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
