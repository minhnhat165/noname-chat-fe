'use client';

import { User } from '@/types/user';
import { useUserStore } from './userStore';

import { useRef } from 'react';

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
