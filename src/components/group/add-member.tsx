'use client';
import { ArrowLeftOutlined } from '@ant-design/icons/lib/icons';
import { Badge, Input, Button, Modal } from 'antd';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { roomApi } from '@/services/room-servers';
import { useUserStore, UserStore } from '@/stores/user';
import { UserChecklist } from '../user/user-checklist';
import { RoomItemSkeleton } from '../room/room-item-skeleton';
import toast from 'react-hot-toast';
import { Room } from '@/types/room';

type Props = {
  setIsAddMember: (value: boolean) => void;
  room?: Room | undefined;
};

const ONE_MINUTE = 60 * 1000;

export const AddMember = ({ room, setIsAddMember }: Props) => {
  const currentUser = useUserStore((state: UserStore) => state.data!);
  const [participants, setParticipants] = useState<string[]>([]);

  const [username, setUsername] = useState('');

  const { mutate, isLoading } = useMutation({
    mutationFn: roomApi.addMember,
    onSuccess: (data) => {
      toast.success('Add new member successfully');
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error?.message);
    },
  });

  const { data: participantsAll, isFetching } = useQuery({
    queryKey: ['participantsAll', username, room?._id, currentUser?._id],
    queryFn: () => roomApi.findParticipantsByUserIdNotInRoom({ id: room?._id || '', q: username }),
    enabled: !!currentUser?._id && !!room?._id,
    // staleTime: ONE_MINUTE,
    // keepPreviousData: true,
  });

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <Button
          onClick={() => setIsAddMember(false)}
          type="text"
          className="mr-4"
          shape="circle"
          icon={<ArrowLeftOutlined />}
          size="large"
        />
        <p className="text-xl font-bold">Add Member</p>
        {participants.length ? (
          <Button
            type="primary"
            onClick={() => mutate({ id: room?._id, participants: participants })}
            className="mr-4"
            size="large"
          >
            Save
          </Button>
        ) : (
          ''
        )}
      </div>
      <div>
        <Input
          className="bg-slate-200 hover:bg-slate-200 focus:bg-slate-200"
          size="large"
          bordered={false}
          placeholder="Add people ..."
          allowClear
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div className="overflow-y-overlay mt-2 max-h-[300px] flex-1">
        {!isFetching ? (
          <UserChecklist
            data={participantsAll?.data}
            participants={participants}
            setParticipants={setParticipants}
          />
        ) : (
          <div className="gap-2">
            <RoomItemSkeleton />
            <RoomItemSkeleton />
            <RoomItemSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMember;
