import { Button, Dropdown, MenuProps, Modal, message } from 'antd';
import {
  DeleteOutlined,
  EllipsisOutlined,
  LogoutOutlined,
  MenuOutlined,
  StopOutlined,
} from '@ant-design/icons';

import GroupMenuModal from '../common/group-menu';
import { Room } from '@/types/room';
import { roomApi } from '@/services/room-servers';
import { useMemo } from 'react';
import { useModal } from '@/hooks/use-modal';
import { useMutation } from '@tanstack/react-query';

const MENU_ITEMS_KEYS = {
  REPORT: '0',
  BLOCK: '1',
  DELETE: '2',
  LEAVE: '3',
  MENU: '4',
};
export const RoomItemMenuAction = ({
  room,
  onDeleted,
}: {
  room: Room;
  onDeleted?: (room: Room) => void;
}) => {
  const { isOpen: isOpenReport, close: closeReport, open: openReport } = useModal();
  const { isOpen: isOpenDelete, close: closeDelete, open: openDelete } = useModal();
  const { isOpen: isOpenBlock, close: closeBlock, open: openBlock } = useModal();
  const { isOpen: isOpenLeave, close: closeLeave, open: openLeave } = useModal();
  const { isOpen: isOpenGroupMenu, close: closeGroupMenu, open: openGroupMenu } = useModal();
  const { mutate, isLoading } = useMutation({
    mutationFn: roomApi.deleteRoom,
    onSuccess: () => {
      message.success('Delete room successfully');
      onDeleted?.(room);
    },
  });

  const { mutate: leaveGroup } = useMutation({
    mutationFn: roomApi.outGroup,
  });

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [
      // {
      //   key: MENU_ITEMS_KEYS.REPORT,
      //   icon: <FlagOutlined />,
      //   label: 'Report',
      // },
    ];

    if (room.isGroup) {
      items.push({
        key: MENU_ITEMS_KEYS.LEAVE,
        icon: <LogoutOutlined />,
        label: 'Leave group',
      });
      if (room.isAdmin) {
        items.push(
          {
            key: MENU_ITEMS_KEYS.DELETE,
            icon: <DeleteOutlined />,
            danger: true,
            label: 'Delete',
          },
          {
            key: MENU_ITEMS_KEYS.MENU,
            icon: <MenuOutlined />,
            danger: true,
            label: 'Menu',
          },
        );
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
        // openReport();
        break;
      case MENU_ITEMS_KEYS.MENU:
        openGroupMenu();
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
      <Dropdown
        overlayClassName="w-40"
        trigger={['click']}
        menu={{ items: menuItems, onClick }}
        placement="bottom"
      >
        <Button
          size="middle"
          type="default"
          shape="circle"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          icon={<EllipsisOutlined />}
        />
      </Dropdown>

      <GroupMenuModal
        room={room}
        open={isOpenGroupMenu}
        onCancel={closeGroupMenu}
        onSubmit={(data) => {
          console.log(data);
          closeGroupMenu();
        }}
      />
      {/* <ReportModal
        open={isOpenGroupMenu}
        onCancel={closeGroupMenu}
        onSubmit={(data) => {
          console.log(data);
          closeGroupMenu();
        }}
      /> */}
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
        onOk={() => {
          mutate(room._id);
          closeDelete();
        }}
        onCancel={closeDelete}
        okButtonProps={{
          danger: true,
        }}
        okText="Delete"
        cancelText="Cancel"
        confirmLoading={isLoading}
      >
        <p>Are you sure you want to delete this chat?</p>
      </Modal>
      <Modal
        title="Leave this chat"
        width={390}
        open={isOpenLeave}
        onOk={() => {
          leaveGroup(room?._id);
          closeLeave();
        }}
        onCancel={closeLeave}
        okButtonProps={{
          danger: true,
        }}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to leave this chat?</p>
      </Modal>
    </>
  );
};
