'use client';

import { notFound, useParams, useSearchParams } from 'next/navigation';

import { CallPanel } from './call-panel';
import { RepairCallPanel } from './repair-call-panel';
import { Spin } from 'antd';
import { callApi } from '@/services/call-services';
import { roomApi } from '@/services/room-servers';
import { useQuery } from '@tanstack/react-query';

export interface CallPageProps {}

export const CallPage = (props: CallPageProps) => {
  const callId = useSearchParams()?.get('call_id');
  const roomId = useParams()?.id as string;
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomApi.getRoom(roomId!),
    enabled: !!roomId,
    onError(err) {
      console.log(err);
    },
  });
  const { data: call, isFetching: callLoading } = useQuery({
    queryKey: ['call', callId],
    queryFn: () => callApi.getCall(callId!),
    enabled: !!callId && !!room,
  });

  if (isLoading || callLoading) {
    return <Spin size="large" />;
  }

  if (!room) {
    notFound();
  }
  if (call) return <CallPanel call={call.data} />;
  return <RepairCallPanel room={room.data} />;
};
