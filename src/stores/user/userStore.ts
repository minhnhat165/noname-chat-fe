import { User } from '@/types/user';
import { create } from 'zustand';

export interface UserStore {
  data: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}
const user: User = {
  id: '1',
  avatar:
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  name: 'Nguyen Minh Nhat',
  email: 'nhatyugioh@gmail.com',
  username: 'nhatyugioh',
};

export const useUserStore = create<UserStore>((set) => ({
  data: user,
  setUser: (data) => {
    return set({ data });
  },
  removeUser: () => set({ data: null }),
}));
