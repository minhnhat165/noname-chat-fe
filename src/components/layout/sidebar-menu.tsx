import { Button, Divider, Menu, MenuProps, Modal } from 'antd';
import {
  EditOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { EditProfilePanel, EditProfilePanelRef } from '../user';
import { useRef, useState } from 'react';

import { Avatar } from '../common/avatar';
import { User } from '@/types/user';
import { useCredentialStore } from '@/stores/credential';
import { useModal } from '@/hooks/use-modal';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/stores/user';

export interface SideBarMenuProps {}

export const SidebarMenu = (props: SideBarMenuProps) => {
  const { data: user, updateUser } = useUserStore((state) => state);
  const { isOpen, close, open } = useModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutateAsync } = useMutation({
    mutationFn: async (data: User) => {
      return data;
    },
    onSuccess: (data: User) => {
      updateUser(data);
    },
  });

  const handleEditProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileEditPanelRef.current?.submit();
      await mutateAsync(data!);
      close();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const profileEditPanelRef = useRef<EditProfilePanelRef>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-2 px-4">
        <Avatar size="medium" src={user!.avatar} />
        <div>
          <h3 className="block font-bold">{user!.username}</h3>
          <p className="inline-block">{user!.email}</p>
        </div>
        <div className="ml-auto">
          <Button onClick={open} type="text" shape="circle" icon={<EditOutlined />} />
        </div>
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
        onOk={handleEditProfile}
        confirmLoading={isLoading}
      >
        <EditProfilePanel ref={profileEditPanelRef} user={user!} />
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

  getItem('Log out', 'logout', <LogoutOutlined />),
];


const MenuAction = () => {
  const { removeCredential } = useCredentialStore();
  const onClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    switch (key) {
      case 'logout':
        removeCredential();
        break;
      default:
        break;
    }
  };
  return <Menu style={{ borderInlineEnd: 'none' }} onClick={onClick} mode="inline" items={items} />;
};

function Footer({}) {
  return (
    <div className="py-2 text-center">
      <p className="text-center text-gray-500">Version 1.0.0</p>
      <div>
        <span className="text-center text-gray-500"> Copy right &copy; 2023</span>{' '}
        <span className="font-bold">Vision.company</span>
      </div>
    </div>
  );
}
