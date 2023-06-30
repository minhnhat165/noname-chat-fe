'use client';

import { AudioOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, ButtonProps, message } from 'antd';
import { Call, CallStatus } from '@/types/call';
import { use, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar } from '../common/avatar';
import { CLOSE_CALL_MESSAGE } from '@/constants';
import { extractRoomByCurrentUser } from '@/utils';
import { usePeerJs } from '@/hooks/call/use-peerjs';
import { useSocketStore } from '@/stores/socket';
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
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    audioEnabled,
    videoEnabled,
    hasRemoteStream,
    endCall,
    acceptCall,
    rejectCall,
    acceptCallLoading,
    endCallLoading,
    rejectCallLoading,
  } = usePeerJs(
    call._id,
    isCaller,
    user._id,
    room.participants.map((p) => p._id),
    isAccepted,
    {
      onRejected: () => {
        message.error('Call has been rejected');
        redirectToCallRepair();
      },
      onEnded: () => {
        message.error('Call has been ended');
        redirectToCallRepair();
      },
    },
  );

  const router = useRouter();
  const pathname = usePathname();

  const redirectToCallRepair = () => {
    router.push(pathname as string);
  };

  const closeCall = () => {
    if (window.opener) {
      window.opener.postMessage({ type: CLOSE_CALL_MESSAGE }, '*');
    }
  };

  const handleEndCall = async () => {
    await endCall(call._id);
    closeCall();
    redirectToCallRepair();
  };

  const handleAcceptCall = () => {
    acceptCall(call._id);
    setIsAccepted(true);
  };

  const handleRejectCall = async () => {
    await rejectCall(call._id);
    closeCall();
  };

  const handleClickPhone: ButtonProps['onClick'] = () => {
    handleAcceptCall();
  };

  const handleClickOffPhone: ButtonProps['onClick'] = () => {
    if (isAccepted) {
      handleEndCall();
      return;
    }
    handleRejectCall();
  };

  if (call.status === CallStatus.ENDED || isEnded) {
    redirectToCallRepair();
  }

  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    return () => {
      if (socket) {
        console.log('leave call');
        socket?.emit('leave-call', call._id);
      }
    };
  }, [call._id, socket]);

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
            onClick={toggleVideo}
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
            onClick={toggleAudio}
          />
          {!audioEnabled && (
            <div className="absolute right-1/2 top-1/2 h-6 w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
          )}
        </div>

        {!isAccepted && (
          <Button
            loading={acceptCallLoading}
            type="primary"
            size="large"
            shape="circle"
            onClick={handleClickPhone}
            icon={<PhoneOutlined rotate={45} />}
          />
        )}

        <Button
          loading={endCallLoading || rejectCallLoading}
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
