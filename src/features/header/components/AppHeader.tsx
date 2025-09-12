// src/components/AppHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Store, User } from "lucide-react";
import React from "react";

export default function AppHeader() {
  const pathname = usePathname();

  const links = [
    {
      href: "/orders",
      label: "Órdenes",
      icon: ShoppingBag,
    },
    {
      href: "/",
      label: "Negocios",
      icon: Store,
    },
    {
      href: "/profile",
      label: "Perfil",
      icon: User,
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-center items-center h-12">
          <ul className="flex space-x-6 sm:space-x-8">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`
                      flex flex-col items-center justify-center gap-1
                      text-xs font-medium transition-colors duration-200
                      ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }
                    `}
                  >
                    <link.icon
                      size={20}
                      strokeWidth={isActive ? 2 : 1.5}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    <span className="mt-1 hidden sm:block">
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}