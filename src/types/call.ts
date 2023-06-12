import { BaseEntity } from './base-entity';
import { Room } from './room';
import { User } from './user';

export enum CallStatus {
  ONGOING = 'ONGOING',
  ENDED = 'ENDED',
}

export type Call = {
  caller: User;
  room: Room;
  acceptedUsers: User[];
  rejectedUsers: User[];
  status: CallStatus;
  createdAt: string;
} & BaseEntity;
