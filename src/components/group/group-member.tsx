'use client';

import { Room } from '@/types/room';
import { Badge, Button, Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Avatar } from '../common/avatar';
import { User } from '@/types/user';
import { useModal } from '@/hooks/use-modal';
import { roomApi } from '@/services/room-servers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSocketStore } from '@/stores/socket/socket-store';
import { RoomEvent } from '../room/room-folder';

type Props = {
  room?: Room | undefined;
};

export const GroupMember = ({ room }: Props) => {
  const { isOpen: isOpenDelete, close: closeDelete, open: openDelete } = useModal();
  const [memberId, setMemberId] = useState('');
  const [members, setMembers] = useState<User[]>([]);

  const queryClient = useQueryClient();
  const handleDeleteMember = () => {
    closeDelete();
    DeleteMember({ id: room?._id, memberId: memberId });
  };

  useEffect(() => {
    if (room) {
      setMembers(room?.participants);
    }
  }, [room]);

  const socket = useSocketStore((state) => state.socket);

  const { mutate: DeleteMember } = useMutation({
    mutationFn: roomApi.deleteMember,
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  const onRemoveMember = useCallback(
    (data: RoomEvent) => {
      queryClient.setQueryData(['room', room?._id], (oldData: any) => {
        return { ...oldData, data: { ...oldData.data, ...data.payload } };
      });
      // setMembers(data.payload?.participants);
      // console.log('member ', members, data?.payload.participants);
    },
    [queryClient],
  );

  useEffect(() => {
    socket?.on('room.removed', onRemoveMember);
    return () => {
      socket?.off('room.removed', onRemoveMember);
    };
  }, [socket, onRemoveMember]);

  return (
    <div className="overflow-y-overlay mt-2 max-h-[300px] flex-1">
      <p className="mb-2 text-center text-xl font-bold">Members</p>
      <ul className="bg-white p-2">
        {members.map((user) => (
          <li key={user._id}>
            <MemberItem user={user} openDelete={openDelete} setMemberId={setMemberId} />
          </li>
        ))}
      </ul>

      <Modal
        title="Delete user"
        width={390}
        open={isOpenDelete}
        onOk={handleDeleteMember}
        onCancel={closeDelete}
        okButtonProps={{
          danger: true,
        }}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
};

export default GroupMember;

export const MemberItem = ({
  user,
  openDelete,
  setMemberId,
}: {
  user: User;
  openDelete: () => void;
  setMemberId: (memberId: string) => void;
}) => {
  return (
    <div
      className={
        'group/item relative flex w-full items-center justify-between rounded-lg bg-white p-2 transition-all hover:bg-slate-100'
      }
    >
      <div className="flex items-center gap-2">
        <Avatar
          src={user?.avatar || 'blob:https://web.telegram.org/cbec96a0-6fd2-4367-8299-e6083d58c51a'}
        />{' '}
        <span className="font-bold text-gray-800">{user?.username}</span>
      </div>
      <Button
        type="primary"
        onClick={() => {
          setMemberId(user?._id);
          openDelete();
        }}
      >
        Delete
      </Button>
    </div>
  );
};
