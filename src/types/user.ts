import { BaseEntity } from './base-entity';

export type User = {
  name: string;
  username: string;
  email: string;
  avatar: string;
} & BaseEntity;
