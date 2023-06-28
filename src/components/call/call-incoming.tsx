'use client';

import { Button, Modal } from 'antd';
import { CloseOutlined, PhoneFilled } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Avatar } from '../common/avatar';
import { callApi } from '@/services/call-services';
import { extractRoomByCurrentUser } from '@/utils';
import { useModal } from '@/hooks/use-modal';
import { useSocketStore } from '@/stores/socket';
import { useUserStore } from '@/stores/user';
import { useWindowCall } from '@/hooks/call';

export interface CallIncomingProps {}

export const CallIncoming = (props: CallIncomingProps) => {
  const user = useUserStore((state) => state.data!);
  const { openWindowCall } = useWindowCall();
  const [callId, setCallId] = useState<string>();
  const socket = useSocketStore((state) => state.socket);
  const { isOpen, close, open } = useModal();
  const { data, isFetching: callLoading } = useQuery({
    queryKey: ['call', callId],
    queryFn: () => callApi.getCall(callId!),
    enabled: !!callId,
  });
  const call = data?.data;

  const room = useMemo(() => {
    if (!call) return null;
    return extractRoomByCurrentUser(call.room, user!);
  }, [call, user]);

  useEffect(() => {
    if (socket) {
      socket.on('incoming-call', (callId: string) => {
        console.log('incoming call', callId);
        setCallId(callId);
        open();
      });
    }
    return () => {
      socket?.off('incoming-call');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const rejectMutation = useMutation({
    mutationFn: callApi.rejectCall,
    onSuccess() {
      socket?.emit('end-call', callId);
    },
  });
  const handleClose = () => {
    rejectMutation.mutate(callId!);
    close();
  };

  const acceptMutation = useMutation({
    mutationFn: callApi.acceptCall,
    onSuccess() {
      openWindowCall(room?._id!, callId!);
      close();
    },
  });

  const handleAccept = () => {
    acceptMutation.mutate(callId!);
    close();
  };

  if (!call) return null;
  const isAccepted = call.acceptedUsers.some((u) => u._id === user._id);
  if (isAccepted) return null;

  return (
    <div>
      <Modal open={isOpen} width={320} onCancel={handleClose} footer={<></>}>
        <div className="flex flex-col items-center justify-center">
          <Avatar size="large" src={room?.avatar} />
          <h2 className="text-xl font-bold">{room?.name} is calling you</h2>
          <span>The call will start as soon as you accept it</span>
          <div className="mt-4 flex justify-center gap-4">
            <Button
              danger
              size="large"
              type="primary"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={handleClose}
            ></Button>
            <Button
              size="large"
              type="primary"
              shape="circle"
              icon={<PhoneFilled />}
              onClick={handleAccept}
            ></Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
