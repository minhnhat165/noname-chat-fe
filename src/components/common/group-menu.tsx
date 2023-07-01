import { Form, Input, Modal, Radio, Space, Button } from 'antd';
import { Report, ReportType } from '@/types/report';
import { Avatar } from '@/components/common/avatar';

import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { GroupName } from '../room/room-name';
import { Room } from '@/types/room';
import GroupEdit from '../group/group-edit';
import { EditFilled } from '@ant-design/icons';
import GroupMember from '../group/group-member';

type GroupMenuModalProps = {
  room?: Room | undefined;
  open: boolean;
  onCancel: () => void;
  onSubmit: (report: Pick<Report, 'type' | 'description'>) => void;
};

const GroupMenuModal: React.FC<GroupMenuModalProps> = ({ room, open, onCancel, onSubmit }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState(room?.name);
  const [croppedFile, setCroppedFile] = useState<Blob | undefined>(undefined);
  const [isEditGroup, setIsEditGroup] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      // title="Report"
      style={{ top: 20 }}
      width={500}
      open={open}
      onCancel={onCancel}
      // onOk={handleOk}
      // okText="Confirm"
      // okButtonProps={{
      //   danger: true,
      // }}
      footer={null}
      confirmLoading={loading}
    >
      {!isEditGroup ? (
        <>
          <HeaderGroup setIsEditGroup={setIsEditGroup} room={room} />
          <GroupMember room={room} />
        </>
      ) : (
        <GroupEdit isOpen={isEditGroup} setIsOpen={setIsEditGroup} room={room} />
      )}

      {/* <GroupName
        isEdit={true}
        groupName={groupName}
        setGroupName={setGroupName}
        setCroppedFile={setCroppedFile}
      /> */}
      {/* <HeaderGroup groupName={groupName} avatar={room?.avatar} /> */}
    </Modal>
  );
};

export default GroupMenuModal;

export const HeaderGroup = ({
  setIsEditGroup,
  room,
}: {
  setIsEditGroup: (isEdit: boolean) => void;
  room: Room | undefined;
}) => {
  return (
    <div>
      <div className="flex">
        <Avatar bordered src={room?.avatar} size="xLarge" alt={room?.name} />
        <div className="ml-4">
          <p className="text-2xl font-bold"> {room?.name} </p>
          <p className="text-md"> {room?.participants.length} members </p>
        </div>
        <div className="ml-5">
          <Button
            type="primary"
            shape="circle"
            icon={<EditFilled />}
            size={'large'}
            onClick={() => {
              setIsEditGroup(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};
