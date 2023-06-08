import { Credential } from './../../types/credential';
import { create } from 'zustand';

export interface CredentialStore {
  data: Credential | null;
  setCredential: (Credential: Credential) => void;
  removeCredential: () => void;
}

export const useCredentialStore = create<CredentialStore>((set) => ({
  data: null,
  setCredential: (data) => {
    return set({ data });
  },
  removeCredential: () => set({ data: null }),
}));
