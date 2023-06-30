'use client';

import { useSidebar } from './sidebar';
import { Button, Drawer, Input, Upload } from 'antd';
import { ArrowLeftOutlined, CameraOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { SidebarPeople } from './sidebar-people';
import { Avatar } from '@/components/common/avatar';
import { useState, Dispatch, SetStateAction } from 'react';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useQuery, useMutation } from '@tanstack/react-query';
import { roomApi } from '@/services/room-servers';
import { UserStore, useUserStore } from '@/stores/user';

const ONE_MINUTE = 60 * 1000;

export interface GroupCreateProps {}

export const GroupCreate = ({}: GroupCreateProps) => {
  const currentUser = useUserStore((state: UserStore) => state.data!);

  const { isStep2CreateGroup, username } = useSidebar();
  // const [username, setUsername] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);

  const { data: participantsAll } = useQuery({
    queryKey: ['participantsAll', username],
    queryFn: () => roomApi.findParitipantsByUserId(username),
    enabled: !!currentUser?._id,
    staleTime: ONE_MINUTE,
    keepPreviousData: true,
  });

  return (
    <>
      {isStep2CreateGroup ? (
        <div>
          <div className="relative">
            <GroupName groupName={groupName} setGroupName={setGroupName} />
          </div>
          <div className="absolute bottom-10 right-4">
            <Button
              type="primary"
              shape="circle"
              icon={<ArrowRightOutlined />}
              size={'large'}
              onClick={() => {}}
            />
          </div>
        </div>
      ) : (
        <div className="h-full bg-slate-200">
          <SidebarPeople
            data={participantsAll?.data}
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
          size="large"
          bordered={false}
          placeholder="Add people ..."
          allowClear
          // onFocus={() => {
          //   setIsSearch(true);
          // }}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export const GroupName = ({
  groupName,
  setGroupName,
}: {
  groupName: string;
  setGroupName: Dispatch<SetStateAction<string>>;
}) => {
  const { isCreateGroup, setIsCreateGroup, setIsSearch, setSearchValue, setIsStep2CreateGroup } =
    useSidebar();
  const [croppedFile, setCroppedFile] = useState<Blob>();
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
      <div className="flex h-14 items-center justify-start bg-white  px-4">
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
