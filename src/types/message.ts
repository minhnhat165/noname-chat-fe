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

type fileType = {
  link: any;
  name: any;
};
export type Message = {
  content?: string;
  sender: String | User;
  room?: String;
  read: boolean;
  type: MessageType;
  call?: Call;
  images?: string[];
  files?: fileType[];
  createdAt?: string;
} & BaseEntity;
export type MessageCreate = {
  message: Partial<Message>;
  isNotTemp: boolean;
};
