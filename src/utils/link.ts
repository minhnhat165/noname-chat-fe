import { Room } from '@/types/room';

export function generateRoomLink(roomId: Room['_id']): string {
  return `/chat/${roomId}`;
}
