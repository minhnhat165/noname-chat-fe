'use client';

import { Button, Divider, Dropdown, MenuProps, Modal } from 'antd';
import {
  EditOutlined,
  FundProjectionScreenOutlined,
  HistoryOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { EditProfilePanel, EditProfilePanelRef } from '../user';
import { redirect, usePathname } from 'next/navigation';
import { useMemo, useRef, useState, useTransition } from 'react';

import { Avatar } from '../common/avatar';
import { CallHistory } from '../call/call-history';
import Link from 'next/link';
import { Role } from '@/types/user';
import { cn } from '@/utils';
import { removeToken } from '@/app/actions';
import { useModal } from '@/hooks/use-modal';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/stores/user';
import { userApi } from '@/services/user-services';

export interface SidebarNavigateProps {}

export const SidebarNavigate = (props: SidebarNavigateProps) => {
  const user = useUserStore((state) => state.data);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { open: openCallHistory, close: closeCallHistory, isOpen: isOpenCallHistory } = useModal();
  return (
    <>
      <div
        className={cn(
          'flex flex-col  border border-l p-2',
          isExpanded ? 'w-64' : 'w-16 items-center',
        )}
      >
        <UserMenu>
          <Avatar size="small" src={user!.avatar} bordered />
          {isExpanded && <h3 className="font-bold"> {user?.username}</h3>}
        </UserMenu>

        <Divider className="my-2" />
        <MainNavigate isExpanded={isExpanded} />
        <Button
          type="text"
          shape="circle"
          className="mt-auto rotate-180"
          size="large"
          title="Expand"
          onClick={() => setIsExpanded((prev) => !prev)}
          icon={
            isExpanded ? (
              <MenuUnfoldOutlined className="rotate-180 transform" />
            ) : (
              <MenuUnfoldOutlined />
            )
          }
        />
      </div>
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

const UserMenu = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, close, open } = useModal();
  const { open: openLogout, close: closeLogout, isOpen: isOpenLogout } = useModal();
  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <EditOutlined />,
      label: 'Edit Profile',
      onClick: open,
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: openLogout,
    },
  ];
  const { data: user, updateUser } = useUserStore((state) => state);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutateAsync } = useMutation({
    mutationFn: userApi.update,
    onSuccess: (data) => {
      updateUser(data.data);
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

  let [isPending, startTransition] = useTransition();
  const logout = () => {
    startTransition(() => {
      removeToken();
      redirect('/login');
    });
  };

  const profileEditPanelRef = useRef<EditProfilePanelRef>(null);
  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']} arrow>
        <div className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 hover:bg-slate-200">
          {children}
        </div>
      </Dropdown>
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
      <Modal
        open={isOpenLogout}
        title="Confirm Logout"
        onOk={logout}
        onCancel={closeLogout}
        okText="Logout"
        cancelText="Cancel"
        confirmLoading={isPending}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </>
  );
};

const MainNavigate = ({ isExpanded }: { isExpanded?: boolean }) => {
  const role = useUserStore((state) => state.data?.role);
  const currentSide = usePathname() as string;
  const isAdminSide: boolean = useMemo(() => {
    return currentSide?.startsWith('/admin');
  }, [currentSide]);
  const { open: openCallHistory, close: closeCallHistory, isOpen: isOpenCallHistory } = useModal();
  return (
    <>
      {role === Role.ADMIN && (
        <Link href="/admin/user" className="flex w-full justify-center">
          <Button
            type="text"
            className={cn(isExpanded && 'flex w-full items-center')}
            shape="default"
            size="large"
            icon={<FundProjectionScreenOutlined />}
          >
            {isExpanded && 'Dashboard'}
          </Button>
        </Link>
      )}

      {!isAdminSide ? (
        <>
          <Button
            type="text"
            className={cn(isExpanded && 'flex items-center')}
            shape="default"
            size="large"
            icon={<UsergroupAddOutlined />}
          >
            {isExpanded && 'Create Group'}
          </Button>
          <Button
            type="text"
            className={cn(isExpanded && 'flex items-center')}
            shape="default"
            size="large"
            onClick={openCallHistory}
            icon={<HistoryOutlined />}
          >
            {isExpanded && 'History'}
          </Button>
        </>
      ) : (
        <>
          <Link href="/chat" className="flex w-full justify-center">
            <Button
              type="text"
              className={cn(isExpanded && 'flex w-full items-center')}
              shape="default"
              size="large"
              icon={<MessageOutlined />}
            >
              {isExpanded && 'Chat'}
            </Button>
          </Link>
          <Link href="/admin/user" className="flex w-full justify-center">
            <Button
              type="text"
              className={cn(isExpanded && 'flex w-full items-center')}
              shape="default"
              size="large"
              icon={<UserOutlined />}
            >
              {isExpanded && 'User'}
            </Button>
          </Link>
          <Link href="/admin/chat" className="flex w-full justify-center">
            <Button
              type="text"
              className={cn(isExpanded && 'flex w-full items-center')}
              shape="default"
              size="large"
              icon={<InboxOutlined />}
            >
              {isExpanded && 'Room chat'}
            </Button>
          </Link>
        </>
      )}
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
