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
  const [roomId, setRoomId] = useState<string>(Id);
  const [isNotTemp, setIsNotTemp] = useState<boolean>(false);
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', Id],
    queryFn: () => roomApi.checkRoom(Id!),
    enabled: !!Id,
  });

  useMemo(() => {
    if (room?.data) {
      setRoomId(room.data._id);
      setIsNotTemp(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Id, room]);

  return (
    <div className="flex h-full flex-col">
      <MessageHeader room={room?.data} />
      <div className="flex flex-grow flex-col items-center overflow-hidden">
        <MessageBody roomId={roomId} />
        <MessageFooter roomId={roomId} isNotTemp={isNotTemp} setRoomId={setRoomId} />
      </div>
    </div>
  );
};

export default Page;
