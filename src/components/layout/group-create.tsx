'use client';

import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { UserStore, useUserStore } from '@/stores/user';
import { useMutation, useQuery } from '@tanstack/react-query';

import { GroupName } from '../room/room-name';
import { LoadingOutlined } from '@ant-design/icons';
import { SidebarPeople } from './sidebar-people';
import { Spin } from 'antd';
import { generateAvatar } from '@/utils/generate-avatar';
import { roomApi } from '@/services/room-servers';
import toast from 'react-hot-toast';
import { uploadImage } from '@/utils/upload-image';
import { useRouter } from 'next/navigation';
import { useSidebar } from './sidebar';

const ONE_MINUTE = 60 * 1000;

export interface GroupCreateProps {}

export const GroupCreate = ({}: GroupCreateProps) => {
  const currentUser = useUserStore((state: UserStore) => state.data!);

  const { isStep2CreateGroup, username, setIsStep2CreateGroup } = useSidebar();
  const [croppedFile, setCroppedFile] = useState<Blob | undefined>(undefined);
  const [groupName, setGroupName] = useState<string | undefined>('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: roomApi.createRoom,
    onSuccess: (data) => {
      setIsUploading(false);
      router.push(`/chat/${data.data._id}`);
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error?.message);
      setIsUploading(false);
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
    if (participants.length < 2) {
      setIsStep2CreateGroup(false);
      toast.error('At least two other member to create group');
      return;
    }

    let avatar: any = croppedFile;
    setIsUploading(true);
    if (!croppedFile) {
      avatar = await generateAvatar(groupName || 'group');
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

  if (isLoading || isUploading) {
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
              isEdit={false}
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
