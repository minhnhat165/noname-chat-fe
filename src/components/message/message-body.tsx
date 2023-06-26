import { Button, Spin, Upload, UploadProps } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MyMessage from './my-message';
import { DisplayAvatar, DisplayName } from './display-info';
import { UserStore, useUserStore } from '@/stores/user';
import { useMessagesStore } from '@/stores/messages/messages-store';
import { Message } from '@/types/message';
import { User } from '@/types/user';
import { useSocketStore } from '@/stores/socket';
import { messageApi } from '@/services/message-services';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UploadOutlined } from '@ant-design/icons';

type Props = {
  roomId: string;
};

const MessageBody = (props: Props) => {
  const user = useUserStore((state: UserStore) => state.data);
  const messages = useMessagesStore((state) => state.messages);
  const { setMessages, removeMessage, addMessage } = useMessagesStore();
  const socket = useSocketStore((state) => state.socket);
  //socket
  useEffect(() => {
    socket?.emit('join-room', props.roomId);
  }, [socket]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messageReceived = (message: Message) => {
    addMessage(message);
  };

  useEffect(() => {
    socket?.on('message.create', messageReceived);
    return () => {
      socket?.off('message.create', messageReceived);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageReceived, socket]);
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const messageRemoved = (id: string) => {
    removeMessage(id);
  };
  useEffect(() => {
    socket?.on('message.delete', messageRemoved);
    return () => {
      socket?.off('message.delete', messageRemoved);
    };
  }, [messageRemoved, socket]);
  //pagination
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['messages', props.roomId],
    queryFn: ({ pageParam = 1 }) => messageApi.getMessages(props.roomId, pageParam, 20),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    const allMessage: Message[] = [];
    data?.pages.forEach((page) => {
      return page.data.forEach((message: Message) => allMessage.push(message));
    });
    setMessages(allMessage);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div
      className="mb-1 flex w-[730px] flex-grow flex-col-reverse overflow-y-auto"
      id="scrollableDiv"
    >
      {messages.length > 0 ? (
        <InfiniteScroll
          dataLength={messages.length || 0}
          next={fetchNextPage}
          hasMore={hasNextPage || false}
          className="!overflow-y-hidden"
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          loader={<Spin size="small" />}
          inverse={true}
          scrollableTarget="scrollableDiv"
        >
          {messages?.map((message, index) => {
            return user?._id == (message.sender as User)._id ? (
              <MyMessage key={message._id} message={message} />
            ) : (
              <div key={message._id} className="mr-1 flex items-end">
                <div className="my-[2px]">
                  <DisplayName messages={messages} index={index} />

                  <div className="flex">
                    <div className="h-[34px] w-[34px]">
                      <DisplayAvatar messages={messages} index={index} />
                    </div>
                    <div className="ml-2 rounded-md bg-white p-2">{message.content}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default MessageBody;
