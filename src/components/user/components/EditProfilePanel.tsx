import { Avatar } from '@/components/Avatar';
import { User } from '@/types/user';
import { Form, Input, Typography } from 'antd';

export interface EditProfilePanelProps {
  user: User;
}

export const EditProfilePanel = ({ user }: EditProfilePanelProps) => {
  const { avatar } = user;
  return (
    <div className="flex flex-col items-center">
      <Avatar src={avatar} size="xLarge" />
      <Typography.Title level={3}>{user.name}</Typography.Title>
      <Form className="w-full">
        <Form.Item>
          <Input />
        </Form.Item>
        <Form.Item>
          <Input.TextArea showCount autoSize={{ minRows: 1, maxRows: 5 }} maxLength={70} />
        </Form.Item>
      </Form>
    </div>
  );
};
