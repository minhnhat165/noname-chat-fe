import { Call, CallStatus } from '@/types/call';
import { rooms, user } from '@/stores/data-test';

import { CallPage } from '@/components/call/call-page';
import { Room } from '@/types/room';
import { getToken } from '@/utils/auth';

// import { CallPage, CallPanel, RepairCallPanel } from '@/components/call';

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
    const response = await fetch(`${process.env.API_BASE_URL}/calls/${id}`);
    console.log(response);
    const res = await response.json();
    return rooms[0];
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

async function getCall(id: string): Promise<Call> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/calls/${id}`);
    const res = await response.json();
    console.log(res);
    return {
      _id: 1,
      room: rooms[0],
      caller: user,
      rejectedUsers: [],
      acceptedUsers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toDateString(),
      status: CallStatus.ONGOING,
    };
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

const Page = async ({ params, searchParams }: CallPageProps) => {
  // const callId = searchParams.call_id;
  // // const room = await getRoom(params.id);
  // const call = callId ? await getCall(callId) : null;
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <CallPage />
    </div>
  );
};

export default Page;
