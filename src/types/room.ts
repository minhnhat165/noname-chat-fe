import { BaseEntity } from './base-entity';
import { Message } from './message';
import { User } from './user';

export type Room = {
  img?: string;
  name: string;
  participants: User[];
  isGroup: boolean;
  admin?: User;
  isAdmin?: boolean;
  lastMessage?: Message;
} & BaseEntity;
