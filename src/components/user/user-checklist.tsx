'use client'
import { Checkbox, Row, Col } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Avatar } from '../common/avatar';
import {Dispatch, SetStateAction} from 'react'

interface UserCheckListProps  {
  participants: string[]
  setParticipants:  Dispatch<SetStateAction<string[]>>;
};

const onChange = (checkedValues: CheckboxValueType[]) => {
  console.log('checked = ', checkedValues);
};

export const UserChecklist = (props: UserCheckListProps) => {
  return (
    <div className="pt-3">
      <Checkbox.Group onChange={onChange}>
        <Row>
          {[1, 2, 3, 4, 5, 6].map((item: number) => (
            <UserItem key={item} value={item} />
          ))}{' '}
        </Row>
      </Checkbox.Group>
    </div>
  );
};

interface UserItemProp {
  value: number;
}

const UserItem = ({ value }: UserItemProp) => {
  return (
    <Col span={24}>
      <div className="my-2 flex items-center gap-2 pl-7">
        <Checkbox value={value} className=""></Checkbox>
        <div className="flex items-center gap-2">
          <Avatar src={'blob:https://web.telegram.org/cbec96a0-6fd2-4367-8299-e6083d58c51a'} />{' '}
          <span className="font-bold text-gray-800">yoooo</span>
        </div>
      </div>
    </Col>
  );
};
