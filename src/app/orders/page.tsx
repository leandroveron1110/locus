"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import OrdersList from "@/features/orders/components/OrdersList";
import AppHeader from "@/features/header/components/AppHeader"; // Asegúrate de que este componente esté disponible

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);

  if (!user)
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Debes iniciar sesión
          </h2>
          <p className="text-gray-500 mt-2">
            Ingresa a tu cuenta para ver y pagar tus órdenes.
          </p>
        </div>
      </main>
    );

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-100">
        <main className="lg:p-8 w-full  px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Mis Órdenes</h1>
              <p className="text-gray-500 mt-1">
                Aquí puedes revisar el estado de tus órdenes y realizar pagos
                pendientes.
              </p>
            </div>

            {/* Orders List */}
            <div className="w-full">
              <OrdersList userId={user.id} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
