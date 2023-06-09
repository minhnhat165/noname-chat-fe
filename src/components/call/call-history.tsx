import { rooms, user } from '@/stores/data-test';

import { Call } from '@/types/call';
import { CallItem } from './call-item';

export interface CallHistoryProps {
  onItemClicked?: (call: Call) => void;
}

const calls: Call[] = [
  {
    id: 1,
    caller: user,
    room: rooms[0],
    status: 'missed',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 11,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 22,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 13123,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 123,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 15,
    caller: user,
    room: rooms[1],
    status: 'rejected',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const CallHistory = ({ onItemClicked }: CallHistoryProps) => {
  return (
    <div className="overflow-y-overlay -mx-2 mt-4 max-h-96">
      <ul className="flex flex-col gap-1">
        {calls.map((call) => {
          return (
            <li key={call.id} onClick={() => onItemClicked?.(call)}>
              <CallItem call={call} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
