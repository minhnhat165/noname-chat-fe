'use client';

import { Button, Dropdown, MenuProps, Modal } from 'antd';
import {
  DeleteOutlined,
  EllipsisOutlined,
  FlagOutlined,
  LogoutOutlined,
  StopOutlined,
} from '@ant-design/icons';

import { Avatar } from '../common/avatar';
import Link from 'next/link';
import ReportModal from '../common/report-modal';
import { Room } from '@/types/room';
import { User } from '@/types/user';
import { cn } from '@/utils/cn';
import { intlFormatDistance } from 'date-fns';
import { useMemo } from 'react';
import { useModal } from '@/hooks/use-modal';
import { useUserStore } from '@/stores/user';

export interface RoomItemProps {
  room: Room;
  isActive?: boolean;
}

const MENU_ITEMS_KEYS = {
  REPORT: '0',
  BLOCK: '1',
  DELETE: '2',
  LEAVE: '3',
};

export const RoomItem = ({ room: _room, isActive }: RoomItemProps) => {
  const user = useUserStore((state) => state.data);
  const room = useMemo(() => {
    return extractRoomByCurrentUser(_room, user!);
  }, [_room, user]);

  const { isOpen: isOpenReport, close: closeReport, open: openReport } = useModal();
  const { isOpen: isOpenDelete, close: closeDelete, open: openDelete } = useModal();
  const { isOpen: isOpenBlock, close: closeBlock, open: openBlock } = useModal();
  const { isOpen: isOpenLeave, close: closeLeave, open: openLeave } = useModal();

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: MENU_ITEMS_KEYS.REPORT,
        icon: <FlagOutlined />,
        label: 'Report',
      },
    ];

    if (room.isGroup) {
      items.push({
        key: MENU_ITEMS_KEYS.LEAVE,
        icon: <LogoutOutlined />,
        label: 'Leave group',
      });
      if (room.isAdmin) {
        items.push({
          key: MENU_ITEMS_KEYS.DELETE,
          icon: <DeleteOutlined />,
          danger: true,
          label: 'Delete',
        });
      }
    } else {
      items.push(
        {
          key: MENU_ITEMS_KEYS.BLOCK,
          icon: <StopOutlined />,
          label: 'Block',
        },
        {
          key: MENU_ITEMS_KEYS.DELETE,
          icon: <DeleteOutlined />,
          danger: true,
          label: 'Delete',
        },
      );
    }

    return items;
  }, [room.isAdmin, room.isGroup]);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case MENU_ITEMS_KEYS.REPORT:
        openReport();
        break;
      case MENU_ITEMS_KEYS.BLOCK:
        openBlock();
        break;
      case MENU_ITEMS_KEYS.DELETE:
        openDelete();
        break;
      case MENU_ITEMS_KEYS.LEAVE:
        openLeave();
        break;
    }
  };

  return (
    <>
      <Link
        href={`/${room.id}`}
        className={cn(
          'group/item relative flex h-[72px] w-full items-center rounded-lg p-2',
          isActive ? 'bg-sky-300' : 'bg-white hover:bg-slate-100',
        )}
      >
        <div>
          <Avatar src={room.img} />
        </div>
        <div className="flex-1 p-2 pl-2">
          <div className="flex">
            <span className="font-bold text-gray-800">{room.name}</span>
            <span className="ml-auto text-xs text-gray-400">
              {intlFormatDistance(new Date(room.lastMessage.createdAt!), new Date(), {
                style: 'short',
              })}
            </span>
          </div>
          <p className="line-clamp-1 text-slate-500">{room.lastMessage.content}</p>
        </div>
        <div className="invisible absolute right-3 top-1/2 -translate-y-1/2 group-hover/item:visible">
          <Dropdown
            overlayClassName="w-40"
            trigger={['click']}
            menu={{ items: menuItems, onClick }}
            placement="bottom"
          >
            <Button size="large" type="default" shape="circle" icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      </Link>
      <ReportModal
        open={isOpenReport}
        onCancel={closeReport}
        onSubmit={(data) => {
          console.log(data);
          closeReport();
        }}
      />
      <Modal
        title="Block user"
        width={390}
        open={isOpenBlock}
        onOk={closeBlock}
        onCancel={closeBlock}
        okButtonProps={{
          danger: true,
        }}
        okText="Block"
        cancelText="Cancel"
      >
        <p>Are you sure you want to block this user?</p>
      </Modal>
      <Modal
        title="Delete this chat"
        width={390}
        open={isOpenDelete}
        onOk={closeDelete}
        onCancel={closeDelete}
        okButtonProps={{
          danger: true,
        }}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this chat?</p>
      </Modal>
      <Modal
        title="Delete this chat"
        width={390}
        open={isOpenLeave}
        onOk={closeLeave}
        onCancel={closeLeave}
        okButtonProps={{
          danger: true,
        }}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this chat?</p>
      </Modal>
    </>
  );
};

export function extractRoomByCurrentUser(room: Room, currentUser: User) {
  if (!room.isGroup) {
    const user: User = room.participant.find((user) => user.id !== currentUser.id) as User;
    if (!user) return room;
    room.img = user.avatar;
    room.name = user.username;
  } else {
    room.isAdmin = room.admin?.id === currentUser.id;
  }

  return room;
}
