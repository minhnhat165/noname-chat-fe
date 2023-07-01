'use client';
import { MoreOutlined, PhoneOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Modal, Tabs } from 'antd';

import { useModal } from '@/hooks/use-modal';
import GroupMenuModal from '../common/group-menu';
import { Room } from '@/types/room';

type MenuHeaderProps = {
  room: Room | undefined;
};

export const MenuHeader = ({ room }: MenuHeaderProps) => {
  const { isOpen: isOpenGroupMenu, close: closeGroupMenu, open: openGroupMenu } = useModal();
  const { isOpen: isOpenTabs, close: closeTabs, open: openTabs } = useModal();

  return (
    <div>
      <div className="flex w-24 items-center justify-between">
        <SearchOutlined />
        <PhoneOutlined />
        <Button
          type="text"
          icon={<MoreOutlined />}
          onClick={() => {
            openGroupMenu();
            openTabs();
          }}
        />
      </div>
      {/* <TabModal open={isOpenTabs} onCancel={closeTabs} /> */}
      <GroupMenuModal
        room={room}
        open={isOpenGroupMenu}
        onCancel={closeGroupMenu}
        onSubmit={(data) => {
          console.log(data);
          closeGroupMenu();
        }}
      />
    </div>
  );
};

const tabKeys = {
  EDIT_GROUP: '1',
  MEMBERS: '2',
};

export const TabModal = ({ open, onCancel }: { open: boolean; onCancel: () => void }) => {
  const { isOpen: isOpenGroupMenu, close: closeGroupMenu, open: openGroupMenu } = useModal();

  const items = [
    {
      label: `Group`,
      key: '1',
      children: (
        <GroupMenuModal
          // room={room}
          open={isOpenGroupMenu}
          onCancel={closeGroupMenu}
          onSubmit={(data) => {
            closeGroupMenu();
          }}
        />
      ),
    },
    {
      label: `Members`,
      key: '2',
      children: <div>emberm</div>,
    },
  ];
  return (
    <Modal
      // title="Report"
      wrapClassName="bg-transparent"
      style={{ top: 20 }}
      width={600}
      open={open}
      onCancel={onCancel}
      footer={null}
      // okText="Confirm"
      // okButtonProps={{}}
    >
      <Tabs
        defaultActiveKey={items[0].key}
        tabPosition={'left'}
        style={{ height: 220 }}
        items={items}
      />
    </Modal>
  );
};
