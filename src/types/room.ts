import { BaseEntity } from './base-entity';
import { Message } from './message';
import { User } from './user';

export type Room = {
  avatar?: string;
  name: string;
  participants: User[];
  isGroup: boolean;
  admin?: User;
  isAdmin?: boolean;
  lastMessage?: Message;
  isUser?: boolean;
} & BaseEntity;

export type RoomDto = {
  avatar?: string;
  name: string;
  participants: string[];
  isGroup: boolean;
  admin?: User;
  isAdmin?: boolean;
  lastMessage?: Message;
  isUser?: boolean;
} & BaseEntity;
