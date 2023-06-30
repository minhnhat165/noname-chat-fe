'use client';
import { Checkbox, Row, Col } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Avatar } from '../common/avatar';
import { Dispatch, SetStateAction } from 'react';
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
    <div className="pt-3">
      <Checkbox.Group onChange={onChange}>
        <Row>
          {data?.map((user: User) => (
            <UserItem key={user?._id} user={user} />
          ))}{' '}
        </Row>
      </Checkbox.Group>
    </div>
  );
};

interface UserItemProp {
  user: User;
}

const UserItem = ({ user }: UserItemProp) => {
  return (
    <Col span={24}>
      <div className="my-2 flex items-center gap-2 pl-7">
        <Checkbox value={user?._id} className=""></Checkbox>
        <div className="flex items-center gap-2">
          <Avatar
            src={
              user?.avatar || 'blob:https://web.telegram.org/cbec96a0-6fd2-4367-8299-e6083d58c51a'
            }
          />{' '}
          <span className="font-bold text-gray-800">{user?.username}</span>
        </div>
      </div>
    </Col>
  );
};
