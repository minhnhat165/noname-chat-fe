import { messageApi } from '@/services/message-services';
import { MessageType } from '@/types/message';
import {
  FileImageOutlined,
  FileTextOutlined,
  LinkOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Dropdown, MenuProps } from 'antd';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';

type Props = { roomId: string };

const MessageFooter = (props: Props) => {
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
    const currentInputElement = inputElement.current;
    if (currentInputElement) {
      currentInputElement.selectionEnd = cursorPosition;
    }
    // inputElement?.current?.selectionEnd = cursorPosition ?? 0;
    inputElement?.current?.focus();
  }, [cursorPosition]);
  const sendFileItem: MenuProps['items'] = [
    {
      key: '1',
      label: 'Send image',
      icon: <FileImageOutlined />,
    },
    {
      key: '2',
      label: 'send file',
      icon: <FileTextOutlined />,
    },
  ];

  const emojiStyle: EmojiStyle = EmojiStyle.NATIVE;

  //api

  // const { data: messages } = useQuery({
  //   queryKey: ['message', roomId],
  //   queryFn: () => messageApi.getMessages(roomId!),
  //   enabled: !!roomId,
  //   onError(err) {
  //     console.log(err);
  //   },
  // });
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

  return (
    <div className="mb-5 mt-2 h-fit w-[730px] flex-shrink-0 rounded-lg bg-white">
      <div className=" flex h-14 w-full items-center">
        <div className="relative flex h-9 w-14 items-center justify-center" ref={emojiPickerRef}>
          <div
            onClick={() => {
              inputElement?.current?.focus();
              setDisplayEmoji((prev) => !prev);
            }}
          >
            <SmileOutlined className="cursor:cursor-pointer text-[22px] text-gray-500" />
          </div>
          {displayEmoji && (
            <div className="absolute bottom-14 left-0 drop-shadow-xl">
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
                room: props.roomId,
              };
              setInputChat('');
              mutation.mutate(message);
            }
          }}
        />

        <div className="relative flex h-9 w-14 items-center justify-center">
          {/* <label htmlFor="file-input" className="hover:cursor-pointer"> */}
          <Dropdown overlayClassName="w-40" menu={{ items: sendFileItem }} placement="topRight">
            <LinkOutlined className="text-[22px] text-gray-500 hover:cursor-pointer hover:text-cyan-600" />
          </Dropdown>

          {/* </label>
        <input
          // onChange={handleFileInputChange}
          id="file-input"
          type="file"
          hidden
          multiple
        /> */}
        </div>
      </div>
    </div>
  );
};

export default MessageFooter;
