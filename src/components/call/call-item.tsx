'use client';

import { ArrowLeftOutlined, DeleteOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';

import { Avatar } from '../common/avatar';
import { Call } from '@/types/call';
import Link from 'next/link';
import { User } from '@/types/user';
import { cn } from '@/utils';
import { extractRoomByCurrentUser } from '../room';
import { generateRoomLink } from '@/utils/link';
import { useUserStore } from '@/stores/user';
import { useWindowCall } from '@/hooks/call';

export interface CallItemProps {
  call: Call;
  onDeleted?: (call: Call) => void;
}

export const CallItem = ({ call, onDeleted }: CallItemProps) => {
  const user = useUserStore((state) => state.data);
  const room = extractRoomByCurrentUser(call.room, user!);
  const isCaller = call.caller.id === user?.id;
  const status = genStatusOfUserByCall(call, user!);
  const isNegative = status === 'rejected' || status === 'missed';

  const { openWindowCall } = useWindowCall();

  return (
    <Link
      href={generateRoomLink(room.id)}
      className="group/item flex items-center rounded-lg p-2 hover:bg-slate-200"
    >
      <Avatar src={room.img} size="medium" />
      <div className="ml-4 flex-1 overflow-hidden">
        <h3 className="line-clamp-1 font-bold">{room.name}</h3>
        <div className="flex items-center gap-1 text-base">
          <ArrowLeftOutlined
            rotate={isCaller ? 135 : -45}
            className={cn('mt-1', isNegative ? 'text-red-500' : 'text-green-500')}
          />{' '}
          <span className="capitalize">{status}</span>&#x2022;
          <span>
            {call.createdAt?.toLocaleString('en-US', {
              timeStyle: 'short',
            })}
          </span>
        </div>
      </div>
      <div className="ml-auto">
        <Popconfirm
          title="Delete this call?"
          description="
            This action cannot be undone."
          onCancel={(e) => {
            e!.stopPropagation();
            e!.preventDefault();
          }}
          onConfirm={(e) => {
            e!.stopPropagation();
            e!.preventDefault();
            onDeleted?.(call);
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            shape="circle"
            type="text"
            danger
            size="large"
            className="invisible transition-all group-hover/item:visible"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            openWindowCall(room.id, '2');
          }}
          shape="circle"
          type="text"
          size="large"
          icon={<PhoneOutlined />}
        />
      </div>
    </Link>
  );
};

type UserCallStatus = 'accepted' | 'rejected' | 'missed' | 'pending';

function genStatusOfUserByCall(call: Call, user: User): UserCallStatus {
  if (call.acceptedUsers.some((u) => u.id === user.id)) {
    return 'accepted';
  }
  if (call.rejectedUsers.some((u) => u.id === user.id)) {
    return 'rejected';
  }
  if (call.status === 'ended') {
    return 'missed';
  }
  return 'pending';
}
