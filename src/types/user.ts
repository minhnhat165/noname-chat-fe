import { BaseEntity } from './base-entity';

export type Role = 'admin' | 'user';
export type UserStatus = 'active' | 'banned';
export type User = {
  username: string;
  email: string;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  role: Role;
} & BaseEntity;
