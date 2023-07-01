'use client';

import MessageBody from '@/components/message/message-body';
import MessageFooter from '@/components/message/message-footer';
import MessageHeader from '@/components/message/message-header';
import { roomApi } from '@/services/room-servers';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
export interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  let Id = useParams()?.id as string;
  const [roomId, setRoomId] = useState(Id);
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomApi.checkRoom(roomId!),
    enabled: !!roomId,
    onError(err) {
      console.log('object');
    },
  });
  let flag = true;
  useMemo(() => {
    if (room?.data) {
      flag = true;
      setRoomId(room.data._id);
    } else {
      flag = false;
    }
  }, [roomId, room]);
  console.log(flag);
  return (
    <div className="flex h-full flex-col">
      <MessageHeader roomId={roomId} flag={flag} />
      <div className="flex flex-grow flex-col items-center overflow-hidden">
        <MessageBody roomId={roomId} />
        <MessageFooter roomId={roomId} setRoomId={setRoomId} flag={flag} />
      </div>
    </div>
  );
};

export default Page;
