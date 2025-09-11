// src/feactures/common/stores/useSocketStore.ts
import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';

interface SocketState {
  socket: Socket | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connected: false,

  connect: () => {
    const socket = getSocket();
    socket.connect();

    socket.on('connect', () => {
      set({ socket, connected: true });
    });

    socket.on('disconnect', () => {
      set({ connected: false });
    });
  },

  disconnect: () => {
    const socket = getSocket();
    socket.disconnect();
    set({ connected: false, socket: null });
  },
}));
