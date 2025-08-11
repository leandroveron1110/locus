"use client"

import { useAuthStore } from "@/features/auth/store/authStore";
import OrdersList from "@/features/orders/components/OrdersList";


export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <p>Debes iniciar sesión</p>;

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Mis Órdenes</h1>
      <OrdersList userId={user.id} />
    </main>
  );
}
