'use client';

import { Dispatch, SetStateAction } from 'react';

import { Avatar } from '../common/avatar';
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { User } from '@/types/user';

interface UserCheckListProps {
  participants: string[];
  data?: User[];
  setParticipants: Dispatch<SetStateAction<string[]>>;
}

export const UserChecklist = ({ setParticipants, data }: UserCheckListProps) => {
  const onChange = (checkedValues: CheckboxValueType[]) => {
    // console.log('checked = ', checkedValues);

    const userIds = checkedValues.map((checkedValue) => checkedValue.toString());
    setParticipants(userIds);
  };

  return (
    <div className="px-2 pt-1">
      <Checkbox.Group onChange={onChange} className="w-full">
        <div className="flex w-full flex-col">
          {data?.map((user: User) => (
            <UserItem key={user?._id} user={user} />
          ))}{' '}
        </div>
      </Checkbox.Group>
    </div>
  );
};

interface UserItemProp {
  user: User;
}

const UserItem = ({ user }: UserItemProp) => {
  return (
    // <Col span={24}>
    <div className="group/item relative  flex w-full items-center gap-2 rounded-lg bg-white p-3 transition-all hover:bg-slate-100">
      <Checkbox value={user?._id} className=""></Checkbox>
      <div className="flex items-center gap-2">
        <Avatar
          src={user?.avatar || 'blob:https://web.telegram.org/cbec96a0-6fd2-4367-8299-e6083d58c51a'}
        />{' '}
        <span className="font-bold text-gray-800">{user?.username}</span>
      </div>
    </div>
    // </Col>
  );
};
