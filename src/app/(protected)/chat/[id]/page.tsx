'use client';

import { Avatar, Button, Dropdown, MenuProps, Modal } from 'antd';
import {
  DeleteOutlined,
  LinkOutlined,
  MoreOutlined,
  PhoneOutlined,
  SearchOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
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
  const childHover = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

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

  const handleHover = () => {
    if (childHover.current) {
      childHover.current.classList.remove('hidden');
    }
  };

  const handleMouseLeave = () => {
    if (childHover.current) {
      childHover.current.classList.add('hidden');
    }
  };
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
        <div className="mb-1 flex w-[630px] flex-grow flex-col-reverse">
          <div className="mr-1 flex items-end">
            <Avatar size="small" icon={<UserOutlined />} />
            <div className="ml-1 w-full">
              <div>Khánh Vi</div>
              <div
                className="flex w-full items-center"
                onMouseEnter={handleHover}
                onMouseLeave={handleMouseLeave}
              >
                <div className="mr-2 rounded-md bg-white p-1">hihihihihi</div>
                <Button
                  type="primary"
                  className="bg-transparent text-black shadow-none hover:!bg-transparent hover:!text-black"
                  shape="circle"
                  size="small"
                  onClick={showModal}
                  icon={<DeleteOutlined />}
                  ref={childHover}
                />
                <Modal
                  title="Confirm deletion"
                  open={open}
                  onOk={handleOk}
                  confirmLoading={confirmLoading}
                  onCancel={handleCancel}
                  okText="Confirm"
                >
                  <p>Confirm delete this message</p>
                </Modal>
              </div>
            </div>
          </div>
        </div>
        {/* footer */}
        <div className="mb-5 h-14 h-fit w-[630px] rounded-lg bg-white">
          <div className="flex h-full w-full items-center">
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
                    // conversationId: conversationId,
                  };
                  setInputChat('');
                  // createMessageMutation.mutate(message);
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
