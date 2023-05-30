import { Button, Divider, Menu, MenuProps, Modal } from 'antd';
import {
  EditOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

import { Avatar } from '../common/avatar';
import { EditProfilePanel } from '../user';
import { User } from '@/types/user';
import { useModal } from '@/hooks/useModal';
import { useUserStore } from '@/stores/user';

export interface SideBarMenuProps {}

export const SidebarMenu = (props: SideBarMenuProps) => {
  const user = useUserStore((state) => state.data) as User;
  const { isOpen, close, open } = useModal();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-2 px-4">
        <Avatar size="medium" src={user.avatar} />
        <div>
          <h3 className="inline-block font-bold">{user.name}</h3>
          <p className="inline-block">{user.email}</p>
        </div>
        <Button onClick={open} type="text" shape="circle" icon={<EditOutlined />} />
      </div>
      <Divider className="my-1" />
      <div className="flex-1">
        <MenuAction />
      </div>
      <Divider className="my-0" />
      <Footer />
      <Modal
        title="Edit Profile"
        width={390}
        open={isOpen}
        centered={true}
        onCancel={close}
        okButtonProps={{ type: 'default' }}
      >
        <EditProfilePanel user={user} />
      </Modal>
    </div>
  );
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Create group', 'create-group', <UsergroupAddOutlined />),

  getItem('Call history', 'call-history', <HistoryOutlined />),

  getItem('Log out', 'sub4', <LogoutOutlined />),
];

const MenuAction = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };
  return (
    <Menu
      style={{ borderInlineEnd: 'none' }}
      onClick={onClick}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};

function Footer({}) {
  return (
    <div className="py-2 text-center">
      <p className="text-center text-gray-500">Version 1.0.0</p>
      <div>
        <span className="text-center text-gray-500"> copy right &copy; 2023</span>{' '}
        <span className="font-bold">Noname Chat App</span>
      </div>
    </div>
  );
}
