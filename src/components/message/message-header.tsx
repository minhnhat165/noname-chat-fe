import { MoreOutlined, PhoneOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';

import React from 'react';

type Props = {};

const MessageHeader = (props: Props) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
          className="text-base"
        >
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
  return (
    <div>
      <div className="flex h-14 w-full flex-shrink-0 items-center justify-between bg-white px-5">
        <div className="flex items-center">
          <Avatar size="large" icon={<UserOutlined />} />
          <span className="ml-2 font-bold text-gray-800">Khánh Vi</span>
        </div>
        <div className="flex w-24 justify-between">
          <SearchOutlined />
          <PhoneOutlined />
          <Dropdown overlayClassName="w-40" menu={{ items }} placement="bottomRight">
            <MoreOutlined />
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
