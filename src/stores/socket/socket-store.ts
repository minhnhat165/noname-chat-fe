import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';

export interface SocketStore {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket) => {
    return set({ socket });
  },
}));
