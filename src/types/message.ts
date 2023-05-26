import { BaseEntity } from './base-entity';
import { User } from './user';

export type Message = {
  content: string;
  user: User;
  read: boolean;
  createdAt: string | Date;
} & BaseEntity;
