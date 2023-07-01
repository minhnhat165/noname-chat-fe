'use client';

import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { Room } from '@/types/room';
import { RoomItem } from './room-item';
import { RoomItemSkeleton } from './room-item-skeleton';
import { Tabs } from 'antd';
import { roomApi } from '@/services/room-servers';
import { toast } from 'react-hot-toast';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useParams } from 'next/navigation';
import { useSidebar } from '../layout/sidebar';
import { useSocketStore } from '@/stores/socket';
import { useUserStore } from '@/stores/user/user-store';

export interface RoomFolderProps {
  shorted?: boolean;
}

export interface RoomEvent {
  userId?: string;
  payload: any;
  type: string;
}

export const RoomFolder = ({ shorted }: RoomFolderProps) => {
  const socket = useSocketStore((state) => state.socket);
  const queryClient = useQueryClient();
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

  let rooms = data?.pages.map((page) => page.data).flat() || [];

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

  const handleRoomUpdated = (data: RoomEvent) => {
    // console.log('data updated ', data);
    if (data.payload?.admin === user?._id) {
      toast.success('Updated new group successfully!!!');
    }
    rooms = rooms.map((room: Room) => {
      if (room._id === data.payload._id) {
        // room = data.payload;
        return data.payload;
      }
      return room;
    });
  };

  const handleRoomRemoved = (data: RoomEvent) => {
    if (data.userId === user?._id) {
      rooms = rooms.filter((room: Room) => room._id !== data.payload._id);
    }
  };

  const handleRoomOuted = (data: RoomEvent) => {
    rooms = rooms.filter((room: Room) => room._id !== data.payload._id);
  };

  const handleReceivedEvent = (data: RoomEvent) => {
    switch (data.type) {
      case 'room.created': {
        handleRoomCreated(data);
        break;
      }
      case 'room.updated': {
        handleRoomUpdated(data);
        break;
      }
      case 'room.removed': {
        handleRoomRemoved(data);
        break;
      }
      case 'room.outed': {
        handleRoomOuted(data);
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
  const updateRooms = (newRoom: Room) => {
    queryClient.setQueryData(['rooms', type], (oldData: any) => {
      let newPages = oldData.pages.map((page: any) => {
        return {
          ...page,
          data: page.data.filter((room: Room) => {
            return room._id !== newRoom._id;
          }),
        };
      });
      return {
        ...oldData,
        pages: [{ data: [newRoom] }, ...newPages],
      };
    });
  };
  const deleteRoom = (roomId: string) => {
    queryClient.setQueryData(['rooms', type], (oldData: any) => {
      let newPages = oldData.pages.map((page: any) => {
        return {
          ...page,
          data: page.data.filter((room: Room) => {
            return room._id !== roomId;
          }),
        };
      });
      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on('update-room', (newRoom: Room) => {
        updateRooms(newRoom);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
      <ul className="bg-white p-2">
        {rooms.map((room) => (
          <li key={room._id}>
            <RoomItem
              room={room}
              isActive={room._id === activeId}
              shorted={shorted}
              onDeleted={() => deleteRoom(room._id)}
            />
          </li>
        ))}
      </ul>
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
