'use client';

import { Button, Modal, Tabs } from 'antd';
import { MoreOutlined, PhoneOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

import GroupMenuModal from '../common/group-menu';
import { Room } from '@/types/room';
import { useCreateCall } from '@/hooks/call/use-create-call';
import { useModal } from '@/hooks/use-modal';
import { useWindowCall } from '@/hooks/call';

type MenuHeaderProps = {
  room: Room | undefined;
};

export const MenuHeader = ({ room }: MenuHeaderProps) => {
  const { isOpen: isOpenGroupMenu, close: closeGroupMenu, open: openGroupMenu } = useModal();
  const { isOpen: isOpenTabs, close: closeTabs, open: openTabs } = useModal();
  const { openWindowCall } = useWindowCall();

  const { mutate, isLoading: callLoading } = useCreateCall({
    onSuccess(data, variables) {
      openWindowCall(variables, data.data._id);
    },
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <Button shape="circle" type="text" size="large" icon={<SearchOutlined />} />
        <Button
          loading={callLoading}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            mutate(room?._id as string);
          }}
          shape="circle"
          type="text"
          size="large"
          icon={<PhoneOutlined />}
        />
        <Button
          shape="circle"
          type="text"
          size="large"
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
