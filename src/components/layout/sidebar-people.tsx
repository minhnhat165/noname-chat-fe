import { Dispatch, SetStateAction } from 'react';
import { UserChecklist } from '../user/user-checklist';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSidebar } from './sidebar';
import { User } from '@/types/user';
import { RoomItemSkeleton } from '../room/room-item-skeleton';

type SidebarPeopleProps = {
  participants: string[];
  data?: User[];
  isFetching: boolean;
  setParticipants: Dispatch<SetStateAction<string[]>>;
};

export const SidebarPeople = ({
  isFetching,
  data,
  participants,
  setParticipants,
}: SidebarPeopleProps) => {
  const { setIsStep2CreateGroup } = useSidebar();

  return (
    <div className="h-full bg-white">
      {!isFetching ? (
        <UserChecklist data={data} participants={participants} setParticipants={setParticipants} />
      ) : (
        <div className="gap-2">
          <RoomItemSkeleton />
          <RoomItemSkeleton />
          <RoomItemSkeleton />
        </div>
      )}
      <div className="absolute bottom-10 right-4">
        {participants.length > 1 ? (
          <Button
            type="primary"
            shape="circle"
            className={participants.length < 2 ? 'opacity-40' : ''}
            // disabled={participants.length < 2 ? true : false}
            icon={<ArrowRightOutlined />}
            size={'large'}
            onClick={() => {
              if (participants.length > 1) {
                setIsStep2CreateGroup(true);
              }
            }}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
