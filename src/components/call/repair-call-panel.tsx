'use client';

import { UserStore, useUserStore } from '@/stores/user';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar } from '../common/avatar';
import { Button } from 'antd';
import { Room } from '@/types/room';
import { extractRoomByCurrentUser } from '@/utils';
import { useCreateCall } from '@/hooks/call/use-create-call';
import { useMemo } from 'react';

export interface RepairCallPanelProps {
  room: Room;
}

export const RepairCallPanel = ({ room: _room }: RepairCallPanelProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state: UserStore) => state.data);
  const room = useMemo(() => {
    return extractRoomByCurrentUser(_room, user!);
  }, [_room, user]);
  const { mutate, isLoading } = useCreateCall({
    onSuccess(data, variables, context) {
      router.push(`${pathname}?call_id=${data.data._id}`);
    },
  });
  return (
    <div className="flex flex-col items-center">
      <Avatar src={room.avatar} size="xLarge" />
      <div className="my-3 text-center">
        <h2 className="text-lg font-bold">{room.name}</h2>
        <p>Ready to call</p>
      </div>
      <Button
        loading={isLoading}
        onClick={() => {
          mutate(room._id);
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
