'use client';

import { AudioOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { Call, CallStatus } from '@/types/call';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar } from '../common/avatar';
import { CLOSE_CALL_MESSAGE } from '@/constants';
import { callApi } from '@/services/call-services';
import { extractRoomByCurrentUser } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { usePeerJs } from '@/hooks/call/use-peerjs';
import { useUserStore } from '@/stores/user';

export interface CallPanelProps {
  call: Call;
}

export const CallPanel = ({ call }: CallPanelProps) => {
  const user = useUserStore((state) => state.data!);
  const room = useMemo(() => {
    return extractRoomByCurrentUser(call.room, user!);
  }, [call.room, user]);
  const isCaller = call.caller._id === user._id;
  const [isAccepted, setIsAccepted] = useState(call.acceptedUsers.some((u) => u._id === user._id));
  const {
    isEnded,
    peerId,
    connectPeer,
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    audioEnabled,
    videoEnabled,
    hasRemoteStream,
    endCall,
  } = usePeerJs(
    call._id,
    isCaller,
    user._id,
    room.participants.map((p) => p._id),
    isAccepted,
  );

  const router = useRouter();
  const pathname = usePathname();
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
    connectPeer(peerId!);
  };

  const handleRejectCall = () => {
    rejectMutation.mutate(call._id);
  };

  const handleToggleVideo: ButtonProps['onClick'] = () => {
    toggleVideo();
  };

  const handleToggleAudio: ButtonProps['onClick'] = () => {
    toggleAudio();
  };

  const handleClickPhone: ButtonProps['onClick'] = () => {
    handleAcceptCall();
  };

  const handleClickOffPhone: ButtonProps['onClick'] = () => {
    if (!room.isGroup) {
      endCall();
    }
    isAccepted ? handleEndCall() : handleRejectCall();
  };

  if (call.status === CallStatus.ENDED || isEnded) {
    router.push(pathname as string);
  }

  return (
    <div className="flex h-full flex-col items-center justify-items-center py-10">
      <video ref={remoteVideoRef} className="absolute left-0 top-0 h-full w-full" />
      <video
        ref={localVideoRef}
        className="absolute bottom-10 right-10 min-w-[200px] max-w-[20%] rounded-lg bg-blue-300"
      ></video>

      {!hasRemoteStream && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Avatar src={room.avatar} size="xLarge" />
          <div className="mb-10 mt-3 text-center">
            <h2 className="text-lg font-bold">{room.name}</h2>
            <p className="text-sm text-gray-500">{isCaller ? 'Calling...' : 'Incoming call...'}</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-4 justify-self-end">
        <div className="relative">
          <Button
            type="default"
            size="large"
            shape="circle"
            icon={<VideoCameraOutlined />}
            onClick={handleToggleVideo}
          />
          {!videoEnabled && (
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
          {!audioEnabled && (
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
