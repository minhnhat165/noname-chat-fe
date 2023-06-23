'use client';
import { messageApi } from '@/services/message-services';
import { Message } from '@/types/message';
import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

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
      className="my-[2px] flex w-full items-center justify-end"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        <Button
          type="primary"
          className=" bg-transparent text-black shadow-none hover:!bg-transparent hover:!text-black"
          shape="circle"
          size="small"
          onClick={showModal}
          icon={<DeleteOutlined />}
        />
      ) : (
        ''
      )}
      <div className="mr-2 rounded-md bg-white p-2">{message.message.content}</div>
      <Modal
        title="Delete this message"
        okText="Confirm"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>Confirm delete this message</p>
      </Modal>
    </div>
  );
};

export default MyMessage;
