'use client';

import { ArrowLeftOutlined, ArrowRightOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, Drawer, Input, Upload } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { UserStore, useUserStore } from '@/stores/user';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Avatar } from '@/components/common/avatar';
import ImgCrop from 'antd-img-crop';
import { SidebarPeople } from './sidebar-people';
import { roomApi } from '@/services/room-servers';
import { useSidebar } from './sidebar';
import { generateAvatar } from '@/utils/generate-avatar';
import { uploadImage } from '@/utils/upload-image';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import toast from 'react-hot-toast';

const ONE_MINUTE = 60 * 1000;

export interface GroupCreateProps {}

export const GroupCreate = ({}: GroupCreateProps) => {
  const currentUser = useUserStore((state: UserStore) => state.data!);

  const { isStep2CreateGroup, username, setIsStep2CreateGroup } = useSidebar();
  const [croppedFile, setCroppedFile] = useState<Blob | undefined>(undefined);
  const [groupName, setGroupName] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);

  const { mutate, isLoading } = useMutation({
    mutationFn: roomApi.createRoom,
    onError: (error: any) => {
      toast.error(error?.message);
    },
  });

  const { data: participantsAll, isFetching } = useQuery({
    queryKey: ['participantsAll', username],
    queryFn: () => roomApi.findParticipantsByUserId(username),
    enabled: !!currentUser?._id,
    staleTime: ONE_MINUTE,
    keepPreviousData: true,
  });

  const handleCreateGroupChat = async () => {
    // console.log('name ', groupName);
    // console.log('croppedFile ', croppedFile);
    // console.log('participants ', participants);

    if (participants.length < 2) {
      setIsStep2CreateGroup(false);
      toast.error('At least two other member to create group');
      return;
    }

    let avatar: any = croppedFile;
    if (!croppedFile) {
      avatar = await generateAvatar(groupName);
    } else {
      const { secure_url } = await uploadImage(croppedFile);
      avatar = secure_url;
    }
    mutate({
      name: groupName,
      avatar,
      participants,
      isGroup: true,
    });
  };

  if (isLoading) {
    return (
      <div className=" flex h-full w-full items-center">
        <Spin className="mx-auto" indicator={<LoadingOutlined style={{ fontSize: 45 }} spin />} />
      </div>
    );
  }

  return (
    <>
      {isStep2CreateGroup ? (
        <div>
          <div className="relative z-[100]">
            <GroupName
              groupName={groupName}
              setGroupName={setGroupName}
              setCroppedFile={setCroppedFile}
            />
          </div>
          <div className="absolute bottom-10 right-4 z-[100]">
            {groupName ? (
              <Button
                type="primary"
                shape="circle"
                icon={<ArrowRightOutlined />}
                size={'large'}
                onClick={handleCreateGroupChat}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      ) : (
        <div className="h-full bg-slate-200">
          <SidebarPeople
            data={participantsAll?.data}
            isFetching={isFetching}
            participants={participants}
            setParticipants={setParticipants}
          />
        </div>
      )}
    </>
  );
};

export const Header = ({
  username,
  setUsername,
}: {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}) => {
  const { isCreateGroup, setIsCreateGroup, setIsSearch, setSearchValue } = useSidebar();
  const { Search } = Input;
  return (
    <div className="mb-3 bg-white px-3 pb-3">
      <div className="flex h-14 items-center justify-start bg-white  px-4">
        <Button
          onClick={() => {
            setIsCreateGroup(false);
            setIsSearch(false);
          }}
          type="text"
          className="mr-4"
          shape="circle"
          icon={<ArrowLeftOutlined />}
          size="large"
        />
        <div>
          <p className="text-lg font-bold">Add Members</p>
        </div>
      </div>
      <div>
        <Input
          className="bg-slate-200 hover:bg-slate-200 focus:bg-slate-200"
          size="large"
          bordered={false}
          placeholder="Add people ..."
          allowClear
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <p className="mt-2 text-center text-[12px] italic text-red-500">
          At least two other members to create new group
        </p>
      </div>
    </div>
  );
};

export const GroupName = ({
  groupName,
  setGroupName,
  setCroppedFile,
}: {
  groupName: string;
  setGroupName: Dispatch<SetStateAction<string>>;
  setCroppedFile: Dispatch<SetStateAction<Blob | undefined>>;
}) => {
  const { isCreateGroup, setIsCreateGroup, setIsSearch, setSearchValue, setIsStep2CreateGroup } =
    useSidebar();
  const [imgPreview, setImgPreview] = useState<string | undefined>(undefined);

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="mb-3 bg-white px-3 pb-3">
      <div className="z-50 flex h-14 items-center justify-start bg-white px-4">
        <Button
          onClick={() => {
            setIsCreateGroup(false);
            setIsSearch(false);
            setIsStep2CreateGroup(false);
          }}
          type="text"
          className="mr-4"
          shape="circle"
          icon={<ArrowLeftOutlined />}
          size="large"
        />
        <div>
          <p className="text-lg font-bold">New Group</p>
        </div>
      </div>
      <div className="relative flex justify-center py-6">
        <Avatar bordered src={imgPreview} size="xLarge" alt={groupName} />
        <ImgCrop rotationSlider>
          <Upload
            multiple={false}
            maxCount={1}
            onPreview={onPreview}
            showUploadList={false}
            customRequest={({ file }) => {
              const newFile = file as Blob;
              setCroppedFile(newFile);
              setImgPreview(URL.createObjectURL(newFile));
            }}
          >
            <div className="relative right-5 top-20 flex items-center justify-center rounded-full bg-white">
              <Button shape="circle" type="default" icon={<CameraOutlined />} />
            </div>
          </Upload>
        </ImgCrop>
      </div>
      <div>
        <Input
          size="large"
          placeholder="Group Name ..."
          allowClear
          onFocus={() => {
            setIsSearch(true);
          }}
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
