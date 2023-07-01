'use client';

import { useEffect, useState } from 'react';

import { RoomItemSkeleton } from './room-item-skeleton';
import { RoomList } from './room-list';
import { Tabs } from 'antd';
import { roomApi } from '@/services/room-servers';
import { useInfiniteQuery } from '@tanstack/react-query';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useParams } from 'next/navigation';
import { useSidebar } from '../layout/sidebar';
import { useUserStore } from '@/stores/user/user-store';
import { toast } from 'react-hot-toast';

export interface RoomFolderProps {
  shorted?: boolean;
}

export interface RoomEvent {
  userId: string;
  payload: any;
  type: string;
}

export const RoomFolder = ({ shorted }: RoomFolderProps) => {
  const user = useUserStore((state) => state.data!);
  const { eventData, setEventData, setIsCreateGroup, setIsStep2CreateGroup, setIsSearch } =
    useSidebar();

  const [type, setType] = useState<'all' | 'direct' | 'group'>('all');
  const { data, refetch, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['rooms', type],
      queryFn: ({ pageParam }) => roomApi.getRooms({ cursor: pageParam, limit: 10, type }),
      getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor,
    });

  const rooms = data?.pages.map((page) => page.data).flat() || [];

  const handleRoomCreated = (data: RoomEvent) => {
    if (data.payload?.admin === user?._id) {
      setIsCreateGroup(false);
      setIsStep2CreateGroup(false);
      setIsSearch(false);
      toast.success('Create new group successfully!!!');
    } else {
      toast.success(`You have been added into a group ${data.payload?.name}`);
    }
    rooms.unshift(data.payload);
  };

  const handleReceivedEvent = (data: RoomEvent) => {
    switch (data.type) {
      case 'room.created': {
        handleRoomCreated(data);
        break;
      }
      case 'room.updated': {
        break;
      }
      case 'room.removed': {
        break;
      }
      case 'room.outed': {
        break;
      }
      default: {
        return;
      }
    }
  };

  useEffect(() => {
    if (eventData) {
      refetch();
      handleReceivedEvent(eventData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage: hasNextPage || false,
    onLoadMore: fetchNextPage,
  });

  const param = useParams();
  const activeId = param?.id as string | null;

  return (
    <div className="">
      <Tabs
        size="small"
        defaultActiveKey="1"
        type="card"
        onChange={(key) => {
          setType(key as 'all' | 'direct' | 'group');
        }}
      >
        <Tabs.TabPane tab="All" key="all"></Tabs.TabPane>
        <Tabs.TabPane tab="Direct" key="direct"></Tabs.TabPane>
        <Tabs.TabPane tab="Group" key="group"></Tabs.TabPane>
      </Tabs>
      <RoomList rooms={rooms} activeId={activeId} shorted={shorted} />
      {(isFetching || hasNextPage) && (
        <div ref={sentryRef} className="gap-2">
          <RoomItemSkeleton />
          <RoomItemSkeleton />
          <RoomItemSkeleton />
        </div>
      )}
    </div>
  );
};
