import { create } from 'zustand';

export type App = {
  usersOnline: string[];
};
export interface AppStore {
  data: App;
  setUsersOnline: (users: string[]) => void;
  addUserOnline: (userId: string) => void;
  removeUserOnline: (userId: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  data: {
    usersOnline: [],
  },
  setUsersOnline: (users) => {
    const uniqueUsers = Array.from(new Set(users));
    return set((state) => ({ data: { ...state.data, usersOnline: uniqueUsers } }));
  },
  addUserOnline: (id: string) => {
    return set((state) => ({
      data: {
        ...state.data,
        usersOnline: Array.from(new Set([...state.data.usersOnline, id])),
      },
    }));
  },

  removeUserOnline: (id) => {
    return set((state) => ({
      data: {
        ...state.data,
        usersOnline: state.data.usersOnline.filter((u) => u !== id),
      },
    }));
  },
}));
