'use client';

import MessageBody from '@/components/message/message-body';
import MessageFooter from '@/components/message/message-footer';
import MessageHeader from '@/components/message/message-header';
import { useParams } from 'next/navigation';

export interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const roomId = useParams()?.id as string;
  return (
    <div className="flex h-full flex-col">
      <MessageHeader roomId={roomId} />
      <div className="flex flex-grow flex-col items-center overflow-hidden">
        <MessageBody roomId={roomId} />
        <MessageFooter roomId={roomId} />
      </div>
    </div>
  );
};

export default Page;
