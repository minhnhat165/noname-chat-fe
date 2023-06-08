'use client';

import { User } from '@/types/user';
import { useRef } from 'react';
import { useUserStore } from './user-store';

interface InitializeUserStoreProps {
  user: User;
}

export const InitializeUserStore = ({ user }: InitializeUserStoreProps) => {
  const initialized = useRef(false);
  if (initialized.current) return null;
  useUserStore.setState({ data: user });
  initialized.current = true;
  return null;
};
