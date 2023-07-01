'use client';
import { useState, useEffect } from 'react';
import { GroupName } from '../room/room-name';
import { Room } from '@/types/room';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { roomApi } from '@/services/room-servers';
import toast from 'react-hot-toast';
import { uploadImage } from '@/utils/upload-image';

type GroupEditProps = {
  room?: Room | undefined;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
const GroupEdit = ({ room, setIsOpen }: GroupEditProps) => {
  const [groupName, setGroupName] = useState(room?.name);
  const [croppedFile, setCroppedFile] = useState<Blob | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(room?.avatar);

  const { mutate, isLoading } = useMutation({
    mutationFn: roomApi.updateRoom,
    onSuccess: () => {
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  useEffect(() => {
    if (!avatar) {
      setAvatar(room?.avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.avatar]);

  const handleUpdate = async () => {
    const data:any = { name: groupName, _id: room?._id };
    let avatarUpdate = avatar;
    if (croppedFile) {
      const { secure_url } = await uploadImage(croppedFile);
      data.avatar = secure_url;
    }
    console.log('data ', data)
    mutate(data);
  };

  return (
    <div>
      <Button
        onClick={() => setIsOpen(false)}
        type="text"
        className="mr-4"
        shape="circle"
        icon={<ArrowLeftOutlined />}
        size="large"
      />
      <GroupName
        avatar={avatar}
        isEdit={true}
        groupName={groupName}
        setGroupName={setGroupName}
        setCroppedFile={setCroppedFile}
      />
      <div className="flex justify-end gap-4">
        <Button
          className="border-white bg-red-600 text-white"
          onClick={() => {
            handleUpdate();
          }}
          disabled={isLoading}
        >
          {' '}
          Confirm
        </Button>
        <Button disabled={isLoading} className="" onClick={() => setIsOpen(false)}>
          {' '}
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default GroupEdit;
