'use client';

import { DisplayAvatar, DisplayName } from '@/components/message/displayInfo';
import MyMessage from '@/components/message/message';
import { messageApi } from '@/services/message-services';
import { MessageType } from '@/types/message';
import { User } from '@/types/user';
import {
  LinkOutlined,
  MoreOutlined,
  PhoneOutlined,
  SearchOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Avatar, Dropdown, MenuProps } from 'antd';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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

  //api
  const mutation = useMutation({
    mutationFn: messageApi.createMessage,
  });
  const roomId = useParams()?.id as string;
  const { data: messages } = useQuery({
    queryKey: ['message', roomId],
    queryFn: () => messageApi.getMessages(roomId!),
    enabled: !!roomId,
    onError(err) {
      console.log(err);
    },
  });
  const _id = '6492b1c0867f0cdeb5fc2869';
  // useUserStore.getState().data!;

  console.log('messageaaa', messages);
  // const { isLoading, isError, data, error } = useQuery({
  //   queryKey: ['todos', roomId],
  //   queryFn: messageApi.getMessages(roomId),
  //   enabled: !!roomId,
  //   onError(err) {
  //     console.log(err);
  //   },
  // });

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 w-full items-center justify-between bg-white px-5">
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
        <div className="mb-1 flex w-[730px] flex-grow flex-col justify-end">
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
                    room: '6492bf2743ceaa45bfbfcc4f',
                    type: MessageType.TEXT,
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
