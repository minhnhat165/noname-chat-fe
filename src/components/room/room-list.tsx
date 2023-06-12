import { Room } from '@/types/room';
import { RoomItem } from './room-item';

export function RoomList({ rooms }: { rooms: Room[] }) {
  return (
    <ul>
      {rooms.map((room) => (
        <li key={room._id}>
          <RoomItem room={room} />
        </li>
      ))}
    </ul>
  );
}
