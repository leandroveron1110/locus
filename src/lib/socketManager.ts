// lib/socketManager.ts
import { io, Socket } from "socket.io-client";

type BusinessSocketMap = Record<string, Socket>;

const sockets: BusinessSocketMap = {};


export function getSocketForUser(userId: string): Socket {
  if (!userId) throw new Error("userId es requerido para crear socket");

  // Si ya existe, devolvemos el mismo socket
  if (sockets[userId]) {
    const socket = sockets[userId];
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  // Crear nueva conexión para este negocio
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    socket.emit("join_role", { role: "user", id: userId });
     console.log(`🟢 Usuario ${userId} conectado al socket`);
  });

  sockets[userId] = socket;
  return socket;
}

/**
 * Devuelve todos los sockets activos.
 */
export function getAllBusinessSockets(): Socket[] {
  return Object.values(sockets);
}

/**
 * Desconecta el socket de un negocio específico (si realmente se desea).
 */
export function disconnectSocketForUser(businessId: string) {
  const socket = sockets[businessId];
  if (socket) {
    socket.disconnect();
    delete sockets[businessId];
  }
}

/**
 * Desconecta y limpia todos los sockets (por ejemplo, al cerrar sesión).
 */
export function disconnectAllSockets() {
  Object.entries(sockets).forEach(([id, socket]) => {
    socket.disconnect();
    console.log(`🧹 Socket del negocio ${id} desconectado`);
  });
  Object.keys(sockets).forEach((key) => delete sockets[key]);
}
