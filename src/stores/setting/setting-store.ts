import { create } from 'zustand';

export type Setting = {
  screen: 'mobile' | 'desktop' | 'tablet';
  theme: 'light' | 'dark';
  language: 'en' | 'vi';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'sans-serif' | 'serif';
};
export interface SettingStore {
  data: Setting;
  setScreen: (screen: Setting['screen']) => void;
}

export const useSettingStore = create<SettingStore>((set) => ({
  data: {
    screen: 'desktop',
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    fontFamily: 'sans-serif',
  },
  setScreen: (screen) => set((state) => ({ data: { ...state.data, screen } })),
}));
