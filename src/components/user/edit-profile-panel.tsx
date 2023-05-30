import { Button, Form, Input, Typography } from 'antd';

import { Avatar } from '@/components/common/avatar';
import { CameraOutlined } from '@ant-design/icons';
import { User } from '@/types/user';

export interface EditProfilePanelProps {
  user: User;
}

export const EditProfilePanel = ({ user }: EditProfilePanelProps) => {
  const { avatar, name } = user;
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar src={avatar} size="xLarge" alt={name} />
        <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-white">
          <Button shape="circle" type="default" icon={<CameraOutlined />} />
        </div>
      </div>
      <Typography.Title level={4}>{user.name}</Typography.Title>
      <Form className="w-full">
        <Form.Item>
          <Input.TextArea
            bordered={false}
            placeholder="Bio"
            showCount
            autoSize={{ minRows: 1, maxRows: 5 }}
            maxLength={70}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
