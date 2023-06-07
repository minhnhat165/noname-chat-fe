import { User } from '@/types/user';
import { create } from 'zustand';
import { user } from '../data-test';

export interface UserStore {
  data: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  data: user,
  setUser: (data) => {
    return set({ data });
  },
  removeUser: () => set({ data: null }),
}));
