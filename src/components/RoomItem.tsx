import { Avatar } from './Avatar';
import Link from 'next/link';
import { Room } from '@/types/room';
import { User } from '@/types/user';
import { cn } from '@/utils/cn';
import { intlFormatDistance } from 'date-fns';
import { useMemo } from 'react';

interface RoomItemProps {
  room: Room;
  isActive?: boolean;
}

const RoomItem = ({ room: _room, isActive }: RoomItemProps) => {
  const room = useMemo(() => {
    const room = { ..._room };
    if (!room.isGroup) {
      const user: User = room.users.find((user) => user.id !== '1') as User;
      if (!user) return room;
      room.img = user.avatar;
      room.name = user.name;
    }
    return room;
  }, [_room]);

  return (
    <Link
      href={`/${room.id}`}
      className={cn(
        'flex h-[72px] w-full items-center rounded-lg p-2',
        isActive ? 'bg-sky-300' : 'bg-white hover:bg-slate-100',
      )}
    >
      <div>
        <Avatar src={room.img} />
      </div>
      <div className="flex-1 p-2 pl-2">
        <div className="flex">
          <span className="font-bold text-gray-800">{room.name}</span>
          <span className="ml-auto text-xs text-gray-400">
            {intlFormatDistance(new Date(room.lastMessage.createdAt!), new Date(), {
              style: 'short',
            })}
          </span>
        </div>
        <p className="line-clamp-1 text-slate-500">{room.lastMessage.content}</p>
      </div>
    </Link>
  );
};

export default RoomItem;

export type { RoomItemProps, Room };
