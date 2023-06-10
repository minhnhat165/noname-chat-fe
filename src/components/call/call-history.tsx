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
    status: 'ended',
    acceptedUsers: [user],
    rejectedUsers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    caller: rooms[1].participants[1],
    room: rooms[1],
    acceptedUsers: [],
    rejectedUsers: [],
    status: 'ended',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    caller: rooms[2].participants[2],
    room: rooms[2],
    acceptedUsers: [],
    rejectedUsers: [rooms[0].participants[0]],
    status: 'ended',
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
