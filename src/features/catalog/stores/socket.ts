// socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      transports: ["websocket"],
      autoConnect: false,
    });

    socket.on("connect", () => {
      if (socket) {
        socket.emit("join_role", { role: "user", id: userId });
      }
    });

    socket.on("disconnect", (reason) => {
    });
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};
