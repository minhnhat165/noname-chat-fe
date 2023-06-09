'use client';

import { Button, Divider, Menu, MenuProps, Modal } from 'antd';
import {
  EditOutlined,
  FundProjectionScreenOutlined,
  HistoryOutlined,
  InboxOutlined,
  LogoutOutlined,
  MessageOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { EditProfilePanel, EditProfilePanelRef } from '../user';
import { useMemo, useRef, useState } from 'react';

import { Avatar } from '../common/avatar';
import { CallHistory } from '../call';
import Link from 'next/link';
import { User } from '@/types/user';
import { useCredentialStore } from '@/stores/credential';
import { useModal } from '@/hooks/use-modal';
import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useSidebar } from './sidebar';
import { useUserStore } from '@/stores/user';

export interface SideBarMenuProps {}

export const SidebarMenu = (props: SideBarMenuProps) => {
  const user = useUserStore((state) => state.data);
  const { closeMenu } = useSidebar();

  const currentSide = usePathname() as string;

  const isAdminSide: boolean = useMemo(() => {
    return currentSide?.startsWith('/admin');
  }, [currentSide]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-2 px-4">
        <Avatar size="medium" src={user!.avatar} />
        <div>
          <h3 className="block font-bold">{user!.username}</h3>
          <p className="inline-block">{user!.email}</p>
        </div>
        <div className="ml-auto">
          <ProfileEdit onClickEdit={closeMenu} />
        </div>
      </div>
      <Divider className="my-1" />
      <div className="flex-1">
        <MenuAction onAction={closeMenu} isAdmin={isAdminSide} />
      </div>
      <Divider className="my-0" />
      <Footer />
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

const MenuAction = ({
  onAction,
  isAdmin,
}: {
  onAction?: (key: string) => void;
  isAdmin: boolean;
}) => {
  const { removeCredential } = useCredentialStore();
  const { role } = useUserStore((state) => state.data!);
  const { open: openCallHistory, close: closeCallHistory, isOpen: isOpenCallHistory } = useModal();
  const items: MenuProps['items'] = useMemo(() => {
    const newItems: MenuProps['items'] = [];
    if (isAdmin) {
      newItems.unshift(
        {
          key: 'home',
          label: <Link href="/">Chat</Link>,
          icon: <MessageOutlined />,
        },
        {
          key: 'user',
          label: <Link href="/admin/user">User</Link>,
          icon: <UserOutlined />,
        },
        {
          key: 'room',
          label: <Link href="/admin/chat">Room chat</Link>,
          icon: <InboxOutlined />,
        },
      );
    } else {
      if (role === 'admin') {
        newItems.unshift({
          key: 'admin',
          label: <Link href="/admin">Admin</Link>,
          icon: <FundProjectionScreenOutlined />,
        });
      }
      newItems.push(
        getItem('Create group', 'create-group', <UsergroupAddOutlined />),
        getItem('Call history', 'call-history', <HistoryOutlined />),
      );
    }
    newItems.push(getItem('Logout', 'logout', <LogoutOutlined />));

    return newItems;
  }, [isAdmin, role]);
  const onClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    onAction?.(key as string);
    switch (key) {
      case 'call-history':
        openCallHistory();
        break;
      case 'logout':
        removeCredential();
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Menu style={{ borderInlineEnd: 'none' }} onClick={onClick} mode="inline" items={items} />
      <Modal
        title="Calls"
        open={isOpenCallHistory}
        onCancel={closeCallHistory}
        footer={null}
        width={390}
      >
        <CallHistory onItemClicked={closeCallHistory} />
      </Modal>
    </>
  );
};

function Footer({}) {
  return (
    <div className="py-2 text-center text-sm opacity-50">
      <p className="text-center text-gray-500">Version 1.0.0</p>
      <div>
        <span className="text-center text-gray-500"> Copy right &copy; 2023</span>{' '}
        <span className="font-bold">Vision.company</span>
      </div>
    </div>
  );
}

const ProfileEdit = ({ onClickEdit }: { onClickEdit?: () => void }) => {
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
    <>
      <Button
        onClick={() => {
          open();
          onClickEdit?.();
        }}
        type="text"
        shape="circle"
        icon={<EditOutlined />}
      />
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
    </>
  );
};
