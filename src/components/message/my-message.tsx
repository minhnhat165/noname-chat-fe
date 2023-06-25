'use client';
import { messageApi } from '@/services/message-services';
import { Message } from '@/types/message';
import { DeleteFilled } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Modal, Tooltip } from 'antd';
import { useState } from 'react';

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

      <div className="ml-4 mr-2 max-w-[60%] rounded-md bg-white px-3 py-2 ">
        {message.message.content}
      </div>

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
