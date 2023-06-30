'use client';

import { UserStore, useUserStore } from '@/stores/user';
import { cn, extractRoomByCurrentUser, generateRoomLink } from '@/utils';

import { Avatar } from '../common/avatar';
import Link from 'next/link';
import { MessageType } from '@/types/message';
import { PhoneOutlined } from '@ant-design/icons';
import { Room } from '@/types/room';
import { RoomItemMenuAction } from './room-item-menu-action';
import { useMemo } from 'react';
import { useTimeDisplay } from '@/hooks/use-time-display';

export interface RoomItemProps {
  room: Room;
  isActive?: boolean;
  shorted?: boolean;
}

export const RoomItem = ({ room: _room, isActive, shorted }: RoomItemProps) => {
  const user = useUserStore((state: UserStore) => state.data);
  const room = useMemo(() => {
    return extractRoomByCurrentUser(_room, user!);
  }, [_room, user]);

  const { lastMessage } = room;

  const renderSubTitle = () => {
    return (
      <span className="line-clamp-1 text-xs text-slate-500">
        {lastMessage?.type === MessageType.CALL ? (
          <span>
            <PhoneOutlined /> call
          </span>
        ) : (
          lastMessage?.content
        )}
      </span>
    );
  };

  return (
    <>
      <Link
        href={generateRoomLink(room._id)}
        className={cn(
          'group/item relative flex w-full items-center rounded-lg p-2 transition-all',
          isActive ? 'bg-slate-200' : 'bg-white hover:bg-slate-100',
        )}
      >
        <Avatar src={room.avatar} />
        {!shorted && (
          <>
            <div className="flex flex-1 flex-col justify-between px-2">
              <div className="flex">
                <span className="font-semibold text-gray-800">{room.name}</span>
                {lastMessage && <TimeDisplay time={lastMessage.createdAt} />}
              </div>
              {renderSubTitle()}
            </div>
            <div className="invisible absolute right-3 top-1/2 -translate-y-1/2 transition-all group-hover/item:visible">
              <RoomItemMenuAction room={room} />
            </div>
          </>
        )}
      </Link>
    </>
  );
};

const TimeDisplay = ({ time }: { time: string | undefined }) => {
  const timeDisplay = useTimeDisplay(new Date(time!));
  return <span className="ml-auto text-xs text-gray-400">{timeDisplay}</span>;
};
