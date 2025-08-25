"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import OrdersList from "@/features/orders/components/OrdersList";

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);

  if (!user)
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
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
    <main className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Órdenes</h1>
        <p className="text-gray-500 mt-1">
          Aquí puedes revisar el estado de tus órdenes y realizar pagos pendientes.
        </p>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <OrdersList userId={user.id} />
      </div>
    </main>
  );
}
