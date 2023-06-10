import { CallPanel, RepairCallPanel } from '@/components/call';
import { rooms, user } from '@/stores/data-test';

import { Call } from '@/types/call';
import { Room } from '@/types/room';

export interface CallPageProps {
  params: {
    id: string;
  };
  searchParams: {
    call_id: string;
  };
}

async function getRoom(id: string): Promise<Room> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/users/${id}`);
    const res = await response.json();
    return rooms[0];
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

async function getCall(id: string): Promise<Call> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/users/${id}`);
    const res = await response.json();
    return {
      id: 1,
      room: rooms[0],
      caller: user,
      rejectedUsers: [],
      acceptedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ongoing',
    };
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

const CallPage = async ({ params, searchParams }: CallPageProps) => {
  const callId = searchParams.call_id;
  const room = await getRoom(params.id);
  const call = callId ? await getCall(callId) : null;
  return (
    <div className="flex h-screen w-full items-center justify-center">
      {call ? <CallPanel call={call} /> : <RepairCallPanel room={room} />}
    </div>
  );
};

export default CallPage;
