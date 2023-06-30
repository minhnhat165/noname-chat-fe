import { Room } from '@/types/room';
import { RoomItem } from './room-item';

export function RoomList({
  rooms,
  activeId,
  shorted,
}: {
  rooms: Room[];
  activeId?: Room['_id'] | null;
  shorted?: boolean;
}) {
  return (
    <ul className="bg-white p-2">
      {rooms.map((room) => (
        <li key={room._id}>
          <RoomItem room={room} isActive={room._id === activeId} shorted={shorted} />
        </li>
      ))}
    </ul>
  );
}
