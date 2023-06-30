import { RoomItemSkeleton } from './room-item-skeleton';
import { RoomList } from './room-list';
import { Tabs } from 'antd';
import { roomApi } from '@/services/room-servers';
import { useInfiniteQuery } from '@tanstack/react-query';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export interface RoomFolderProps {
  shorted?: boolean;
}

export const RoomFolder = ({ shorted }: RoomFolderProps) => {
  const [type, setType] = useState<'all' | 'direct' | 'group'>('all');
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['rooms', type],
      queryFn: ({ pageParam }) => roomApi.getRooms({ cursor: pageParam, limit: 10, type }),
      getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor,
    });

  const rooms = data?.pages.map((page) => page.data).flat() || [];

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
        defaultActiveKey="1"
        type="card"
        className="-mx-2"
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
