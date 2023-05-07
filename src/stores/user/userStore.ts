import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface UserStore {
  data: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  data: null,
  setUser: (data) => {
    return set({ data });
  },
  removeUser: () => set({ data: null }),
}));
