import { Room } from '@/types/room';

export function generateRoomLink(roomId: Room['id']): string {
  return `/chat/${roomId}`;
}
