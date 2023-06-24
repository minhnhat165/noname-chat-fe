'use client';

import { DisplayAvatar, DisplayName } from '@/components/message/display-info';
import MyMessage from '@/components/message/my-message';
import { messageApi } from '@/services/message-services';
import { useSocketStore } from '@/stores/socket';
import { Message, MessageType } from '@/types/message';
import { User } from '@/types/user';
import {
  LinkOutlined,
  MoreOutlined,
  PhoneOutlined,
  SearchOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Dropdown, MenuProps } from 'antd';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
export interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  // const user = await getUserGithub(params.id);
  const [inputChat, setInputChat] = useState('');
  const [displayEmoji, setDisplayEmoji] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputElement = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const socket = useSocketStore((state) => state.socket);
  const queryClient = useQueryClient();

  const pickerEmoji = (emoji: string) => {
    inputElement?.current?.focus();
    const currentPosition = inputElement?.current?.selectionStart ?? 0;
    let message =
      inputChat.substring(0, currentPosition) + emoji + inputChat.substring(currentPosition);
    setInputChat(message);
    setCursorPosition(currentPosition + emoji.length);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setDisplayEmoji(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [emojiPickerRef]);

  useEffect(() => {
    const currentInputElement = inputElement.current;
    if (currentInputElement) {
      currentInputElement.selectionEnd = cursorPosition;
    }
    // inputElement?.current?.selectionEnd = cursorPosition ?? 0;
    inputElement?.current?.focus();
  }, [cursorPosition]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
  const emojiStyle: EmojiStyle = EmojiStyle.NATIVE;
  //socket
  useEffect(() => {
    socket?.emit('join-room', roomId);
  }, [socket]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messageReceived = (message: Message) => {
    queryClient.setQueryData(['message', roomId], (oldData: any) => [...oldData, message]);
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
    queryClient.setQueryData(['message', roomId], (oldData: any) => {
      return oldData.filter((message: Message) => message._id !== id);
    });
  };
  useEffect(() => {
    socket?.on('message.delete', messageRemoved);
    return () => {
      socket?.off('message.delete', messageRemoved);
    };
  }, [messageRemoved, socket]);
  //api

  const roomId = useParams()?.id as string;
  // const { data: messages } = useQuery({
  //   queryKey: ['message', roomId],
  //   queryFn: () => messageApi.getMessages(roomId!),
  //   enabled: !!roomId,
  //   onError(err) {
  //     console.log(err);
  //   },
  // });
  const _id = '6492b1c0867f0cdeb5fc2869';
  const mutation = useMutation({
    mutationFn: messageApi.createMessage,
  });
  // useUserStore.getState().data!;

  // const { isLoading, isError, data, error } = useQuery({
  //   queryKey: ['todos', roomId],
  //   queryFn: messageApi.getMessages(roomId),
  //   enabled: !!roomId,
  //   onError(err) {
  //     console.log(err);
  //   },
  // });
  //pagination
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...result
  } = useInfiniteQuery({
    queryKey: ['messages', roomId],
    queryFn: ({ pageParam = 1 }) => messageApi.getMessages(roomId, pageParam, 10),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    // getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
  });
  const messages = useMemo(() => {
    const allMessage: Message[] = [];
    console.log(hasNextPage);
    data?.pages.forEach((page) => {
      return page.data.forEach((message) => allMessage.push(message));
    });
    return allMessage;
  }, [data]);
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 w-full flex-shrink-0 items-center justify-between bg-white px-5">
        <div className="flex items-center">
          <Avatar size="large" icon={<UserOutlined />} />
          <span className="ml-2 font-bold text-gray-800">Khánh Vi</span>
        </div>
        <div className="flex w-24 justify-between">
          <SearchOutlined />
          <PhoneOutlined />
          <Dropdown menu={{ items }} placement="bottomRight">
            <MoreOutlined />
          </Dropdown>
        </div>
      </div>

      <div className="flex flex-grow flex-col items-center">
        {/* <div className="mb-1 flex w-[730px] flex-grow flex-col justify-end"> */}
        {/* //-reverse */}
        <div
          className="mb-1 flex w-[730px] flex-grow flex-col-reverse overflow-y-auto"
          id="scrollableDiv"
        >
          <InfiniteScroll
            dataLength={messages.length || 0}
            next={fetchNextPage}
            hasMore={hasNextPage}
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
            loader={<h4>Loading...</h4>}
            inverse={true}
            scrollableTarget="scrollableDiv"
          >
            {messages?.map((message, index) => {
              return _id == (message.sender as User)._id ? (
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
        </div>
        {/* footer */}
        <div className="mb-5 mt-2 h-fit w-[730px] rounded-lg bg-white">
          <div className=" flex h-14 w-full items-center">
            <div
              className="relative flex h-9 w-14 items-center justify-center"
              ref={emojiPickerRef}
            >
              <div
                onClick={() => {
                  inputElement?.current?.focus();
                  setDisplayEmoji((prev) => !prev);
                }}
              >
                <SmileOutlined className="cursor:cursor-pointer text-[22px] text-gray-500" />
              </div>
              {displayEmoji && (
                <div className="absolute bottom-10 right-0 drop-shadow-xl">
                  <EmojiPicker
                    onEmojiClick={(emoji: { emoji: string }) => pickerEmoji(emoji.emoji)}
                    emojiStyle={emojiStyle}
                    autoFocusSearch={false}
                  />
                </div>
              )}
            </div>
            <input
              placeholder="Message"
              className="block h-12 flex-1 text-black focus:outline-none"
              value={inputChat}
              onChange={(e) => {
                setInputChat(e.target.value);
              }}
              ref={inputElement}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const message = {
                    content: inputElement?.current?.value,
                    type: MessageType.TEXT,
                    room: roomId,
                  };
                  setInputChat('');
                  mutation.mutate(message);
                }
              }}
            />

            <div className="relative flex h-9 w-14 items-center justify-center">
              <label htmlFor="file-input" className="hover:cursor-pointer">
                <LinkOutlined className="text-[22px] text-gray-500 hover:cursor-pointer" />
              </label>
              <input
                // onChange={handleFileInputChange}
                id="file-input"
                type="file"
                hidden
                multiple
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
