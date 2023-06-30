import { messageApi } from '@/services/message-services';
import { useMessagesStore } from '@/stores/messages/messages-store';
import { useSocketStore } from '@/stores/socket';
import { UserStore, useUserStore } from '@/stores/user';
import { Message, MessageType } from '@/types/message';
import { User } from '@/types/user';
import { FileTextFilled } from '@ant-design/icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Image, Spin, message } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DisplayAvatar, DisplayName } from './display-info';
import MyMessage from './my-message';

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    console.log(data?.pages);
    data?.pages?.[data?.pages.length - 1].data.forEach((message: Message) =>
      allMessage.push(message),
    );
    setMessages([...messages, ...allMessage]);

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
                    {message.type === MessageType.TEXT && (
                      <div className="ml-4 mr-2 max-w-[60%] rounded-md bg-white px-3 py-2 ">
                        {message.content}
                      </div>
                    )}
                    {message.type === MessageType.IMAGE && (
                      <div className="ml-4 mr-2 max-w-[60%] rounded-md bg-white px-3 py-2 ">
                        <p>{message.content}</p>
                        <Image.PreviewGroup
                          preview={{
                            onChange: (current, prev) =>
                              console.log(`current index: ${current}, prev index: ${prev}`),
                          }}
                        >
                          {message.images?.map((image, index) => (
                            <Image key={index} alt="image" src={image} />
                          ))}
                        </Image.PreviewGroup>
                      </div>
                    )}
                    {message.type === MessageType.FILE && (
                      <div className="ml-4 mr-2 max-w-[60%] rounded-md bg-white px-3 py-2">
                        {!!message.content && (
                          <div className=" rounded-md bg-white">{message.content}</div>
                        )}
                        {message.files?.map((file, index) => (
                          <div key={index} className=" my-[2px] mr-5  rounded-md bg-white py-1">
                            <a href={file.link} className="inline-block h-3 w-fit">
                              <div className="flex items-center">
                                <FileTextFilled style={{ fontSize: '40px', color: '#3390ec' }} />
                                <p className="ml-1 font-medium">{file.name}</p>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
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
