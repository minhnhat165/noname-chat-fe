import { BaseEntity } from './base-entity';

export type User = {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
} & BaseEntity;
