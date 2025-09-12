"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Store, User, Menu } from "lucide-react";
import React, { useState } from "react";

export default function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/orders", label: "Órdenes", icon: ShoppingBag },
    { href: "/", label: "Negocios", icon: Store },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Menú hamburguesa móvil */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={28} />
        </button>

        {/* Menú de navegación escritorio */}
        <ul className="hidden md:flex gap-10 mx-auto">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex flex-col items-center justify-center gap-1
                    text-sm font-medium transition-colors duration-200
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

        {/* Perfil usuario a la derecha */}
        <Link
          href="/profile"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <User size={28} />
          <span className="hidden sm:block font-medium text-sm">Perfil</span>
        </Link>
      </div>

      {/* Menú desplegable móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <ul className="flex flex-col gap-4 p-4">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
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
