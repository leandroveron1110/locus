"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import AppHeader from "@/features/header/components/AppHeader";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    redirect("/login");
  }

  return (
    <>
    <AppHeader />
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Datos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">ID</p>
            <p className="font-medium">{user.id}</p>
          </div>
        </div>
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>


        {/* Botón logout */}
        <div className="pt-4">
          <button
            onClick={() => useAuthStore.getState().logout()} 
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
