'use client';

import { AudioOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar } from '../common/avatar';
import { CLOSE_CALL_MESSAGE } from '@/constants';
import { Call } from '@/types/call';
import { Room } from '@/types/room';
import { callApi } from '@/services/call-services';
import { extractRoomByCurrentUser } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/stores/user';

export interface CallPanelProps {
  call: Call;
}

export const CallPanel = ({ call }: CallPanelProps) => {
  const user = useUserStore((state) => state.data!);

  const room = useMemo(() => {
    return extractRoomByCurrentUser(call.room, user!);
  }, [call.room, user]);

  const router = useRouter();

  const pathname = usePathname();

  const isCaller = true;

  const [isUseVideo, setIsUseVideo] = useState(false);
  const [isUseAudio, setIsUseAudio] = useState(true);
  const [isAccepted, setIsAccepted] = useState(call.acceptedUsers.some((u) => u._id === user._id));

  const acceptMutation = useMutation({
    mutationFn: callApi.acceptCall,
    onSuccess() {
      setIsAccepted(true);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: callApi.rejectCall,
    onSuccess() {
      closeCall();
    },
  });

  const endMutation = useMutation({
    mutationFn: callApi.endCall,
    onSuccess() {
      closeCall();
      router.push(pathname as string);
    },
  });

  const closeCall = () => {
    if (window.opener) {
      window.opener.postMessage({ type: CLOSE_CALL_MESSAGE }, '*');
    }
  };

  const handleEndCall = () => {
    endMutation.mutate(call._id);
  };

  const handleAcceptCall = () => {
    acceptMutation.mutate(call._id);
    setIsAccepted(true);
  };

  const handleRejectCall = () => {
    rejectMutation.mutate(call._id);
  };

  const handleToggleVideo: ButtonProps['onClick'] = () => {
    setIsUseVideo((prev) => !prev);
  };

  const handleToggleAudio: ButtonProps['onClick'] = () => {
    setIsUseAudio((prev) => !prev);
  };

  const handleClickPhone: ButtonProps['onClick'] = () => {
    handleAcceptCall();
  };
  const handleClickOffPhone: ButtonProps['onClick'] = () => {
    isAccepted ? handleEndCall() : handleRejectCall();
  };

  return (
    <div className="flex h-full flex-col items-center justify-items-center py-10">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Avatar src={room.avatar} size="xLarge" />
        <div className="mb-10 mt-3 text-center">
          <h2 className="text-lg font-bold">{room.name}</h2>
          <p className="text-sm text-gray-500">{isCaller ? 'Calling...' : 'Incoming call...'}</p>
        </div>
      </div>
      <div className="flex gap-4 justify-self-end">
        <div className="relative">
          <Button
            type="default"
            size="large"
            shape="circle"
            icon={<VideoCameraOutlined />}
            onClick={handleToggleVideo}
          />
          {!isUseVideo && (
            <div className="absolute right-1/2 top-1/2 h-6 w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
          )}
        </div>
        <div className="relative">
          <Button
            type="default"
            size="large"
            shape="circle"
            icon={<AudioOutlined />}
            onClick={handleToggleAudio}
          />
          {!isUseAudio && (
            <div className="absolute right-1/2 top-1/2 h-6 w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
          )}
        </div>

        {!isAccepted && (
          <Button
            loading={acceptMutation.isLoading}
            type="primary"
            size="large"
            shape="circle"
            onClick={handleClickPhone}
            icon={<PhoneOutlined rotate={45} />}
          />
        )}

        <Button
          loading={acceptMutation.isLoading || rejectMutation.isLoading || endMutation.isLoading}
          type="primary"
          size="large"
          danger
          shape="circle"
          onClick={handleClickOffPhone}
          icon={<PhoneOutlined rotate={225} />}
        />
      </div>
    </div>
  );
};
