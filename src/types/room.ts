import { BaseEntity } from './base-entity';
import { Message } from './message';
import { User } from './user';

export type Room = {
  img?: string;
  name: string;
  description: string;
  users: User[];
  messages?: Message[];
  isGroup: boolean;
  lastMessage: Message;
} & BaseEntity;
