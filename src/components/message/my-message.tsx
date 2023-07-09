'use client';

import { Button, Image, Modal, Tooltip } from 'antd';
import { DeleteFilled, FileTextFilled, PhoneOutlined } from '@ant-design/icons';
import { Message, MessageType } from '@/types/message';
import { ReactNode, useState } from 'react';

import { formatDateTime } from '@/hooks/use-time-display';
import { messageApi } from '@/services/message-services';
import { useMutation } from '@tanstack/react-query';

export interface MessageProps {
  message: Message;
}

const MyMessage = (message: MessageProps) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const deleteMessage = useMutation({
    mutationFn: () => messageApi.deleteMessage(message.message._id),
    onSuccess: () => {
      setOpen(false);
      setConfirmLoading(false);
    },
  });

  const handleOk = () => {
    setConfirmLoading(true);
    deleteMessage.mutate();
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  return (
    <div
      key={message.message._id}
      className="my-[2px] flex w-full  items-center justify-end"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        <Tooltip title="Delete">
          <Button
            type="primary"
            className=" !bg-slate-300 text-[#a3a4a6] shadow-none hover:!bg-slate-400 hover:!text-black"
            shape="circle"
            size="small"
            onClick={showModal}
            icon={<DeleteFilled />}
          />
        </Tooltip>
      ) : (
        ''
      )}
      {message.message.type === MessageType.TEXT && (
        <MessageWrapper>{message.message.content}</MessageWrapper>
      )}
      {message.message.type === MessageType.IMAGE && (
        <MessageWrapper>
          <p>{message.message.content}</p>
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) =>
                console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            {message.message.images?.map((image, index) => (
              <Image key={index} alt="image" src={image} />
            ))}
          </Image.PreviewGroup>
        </MessageWrapper>
      )}
      {message.message.type === MessageType.FILE && (
        <MessageWrapper>
          {!!message.message.content && (
            <div className=" rounded-md">{message.message.content}</div>
          )}
          {message.message.files?.map((file, index) => (
            <div key={index} className=" my-[2px] mr-5 rounded-md">
              <a href={file.link} className="inline-block h-3 w-fit">
                <div className="flex items-center">
                  <FileTextFilled style={{ fontSize: '40px', color: '#f63d97' }} />
                  <p className="ml-1  p-1 font-medium">{file.name}</p>
                </div>
              </a>
            </div>
          ))}
        </MessageWrapper>
      )}
      {message.message.type === MessageType.CALL && (
        <MessageWrapper>
          <div className="flex">
            <div className="mr-2">
              <p className="mb-1 font-medium">Message Call</p>
              <p className="text-xs text-[#cfd8d8]">{formatDateTime(message.message.createdAt)}</p>
            </div>
            <PhoneOutlined style={{ fontSize: '40px', color: '#f63d97' }} />
          </div>
        </MessageWrapper>
      )}
      <Modal
        title="Delete this message"
        okText="Delete"
        open={open}
        onOk={handleOk}
        okButtonProps={{
          danger: true,
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>Confirm delete this message</p>
      </Modal>
    </div>
  );
};

const MessageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="ml-4 mr-2 max-w-[60%] rounded-lg bg-gradient-to-r from-blue-500 to-purple-500  px-3 py-2 text-white">
      {children}
    </div>
  );
};

export default MyMessage;
