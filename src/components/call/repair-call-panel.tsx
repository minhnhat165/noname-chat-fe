'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Avatar } from '../common/avatar';
import { Button } from 'antd';
import { Room } from '@/types/room';
import { extractRoomByCurrentUser } from '../user/user-item';
import { useMemo } from 'react';
import { useUserStore } from '@/stores/user';

export interface RepairCallPanelProps {
  room: Room;
}

export const RepairCallPanel = ({ room: _room }: RepairCallPanelProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.data);
  const room = useMemo(() => {
    return extractRoomByCurrentUser(_room, user!);
  }, [_room, user]);

  return (
    <div className="flex flex-col items-center">
      <Avatar src={room.img} size="xLarge" />
      <div className="my-3 text-center">
        <h2 className="text-lg font-bold">{room.name}</h2>
        <p>Ready to call</p>
      </div>
      <Button
        onClick={() => {
          router.push(`${pathname}?call_id=${2}`);
        }}
        type="primary"
        shape="round"
        className="mt-2"
      >
        Start Call
      </Button>
    </div>
  );
};
