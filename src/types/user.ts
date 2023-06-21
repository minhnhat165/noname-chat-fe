import { BaseEntity } from './base-entity';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}
export type User = {
  username: string;
  email: string;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  role: Role;
} & BaseEntity;
