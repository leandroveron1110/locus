// features/common/hooks/useBusinessSocket.ts
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocketForUser } from "../socketManager";

export function useUserSocket(userId: string | undefined): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socketInstance = getSocketForUser(userId);
    setSocket(socketInstance);

    return () => {
      // 🔹 NO desconectamos el socket aquí (persistente)
      // solo removemos listeners en hooks específicos
    };
  }, [userId]);

  return socket;
}
