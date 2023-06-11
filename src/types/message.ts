import { BaseEntity } from './base-entity';
import { Call } from './call';
import { Room } from './room';
import { User } from './user';

export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE',
  IMAGE = 'IMAGE',
  CALL = 'CALL',
}
export type Message = {
  content: string;
  sender: User;
  room?: Room;
  read: boolean;
  type: MessageType;
  call?: Call;
  images?: string;
  createdAt: string;
} & BaseEntity;
