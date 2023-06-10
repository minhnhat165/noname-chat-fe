import { BaseEntity } from './base-entity';
import { Room } from './room';
import { User } from './user';

type CallStatus = 'ongoing' | 'ended' ;

export type Call = {
  caller: User;
  room: Room;
  acceptedUsers: User[];
  rejectedUsers: User[];
  status: CallStatus;
} & BaseEntity;
