'use client';
import { Message } from '@/types/message';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

export interface MessageProps {
  message: Message;
}

const MyMessage = (message: MessageProps) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
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
  );
};

export default MyMessage;
