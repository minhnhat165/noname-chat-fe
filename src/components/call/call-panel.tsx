import { AudioOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { SyntheticEvent, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar } from '../common/avatar';
import { CLOSE_CALL_MESSAGE } from '@/constants';
import { Call } from '@/types/call';
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

  const { connectPeer, localVideoRef, remoteVideoRefs, toggleVideo, toggleAudio } = usePeerJs();

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

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

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
    connectPeer(call._id, remoteVideoRef.current!);
  };

  const handleRejectCall = () => {
    rejectMutation.mutate(call._id);
  };

  const handleToggleVideo: ButtonProps['onClick'] = () => {
    setIsUseVideo((prev) => !prev);
    toggleVideo();
  };

  const handleToggleAudio: ButtonProps['onClick'] = () => {
    setIsUseAudio((prev) => !prev);
    toggleAudio();
  };

  const handleClickPhone: ButtonProps['onClick'] = () => {
    handleAcceptCall();
  };

  const handleClickOffPhone: ButtonProps['onClick'] = () => {
    connectPeer(call._id, remoteVideoRef.current!);
    // isAccepted ? handleEndCall() : handleRejectCall();
  };

  return (
    <div className="flex h-full flex-col items-center justify-items-center py-10">
      <video
        ref={remoteVideoRef}
        className="absolute left-0 top-0 h-screen w-screen bg-black"
      ></video>
      <video
        ref={localVideoRef}
        className="absolute bottom-10 right-10 max-w-xs rounded-lg bg-blue-300"
      ></video>

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
      <div className="relative bg-white">
        <form
          onSubmit={(e: SyntheticEvent) => {
            e.preventDefault();
            const target = e.target as typeof e.target & {
              id: { value: string };
            };
            if (target.id.value) {
              connectPeer(target.id.value, remoteVideoRef.current!);
            }
          }}
        >
          <input name="id" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
