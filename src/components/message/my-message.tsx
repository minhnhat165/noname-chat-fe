'use client';
import { messageApi } from '@/services/message-services';
import { Message, MessageType } from '@/types/message';
import {
  DeleteFilled,
  DownCircleFilled,
  DownloadOutlined,
  FileTextFilled,
  FileTextOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Image, Modal, Tooltip, Upload } from 'antd';
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
      {message.message.type === MessageType.TEXT && (
        <div className="ml-4 mr-2 max-w-[60%] rounded-md bg-white px-3 py-2 ">
          {message.message.content}
        </div>
      )}
      {message.message.type === MessageType.IMAGE && (
        <div className="ml-4 mr-2 max-w-[60%] rounded-md bg-white px-3 py-2 ">
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
        </div>
      )}
      {message.message.type === MessageType.FILE && (
        <div className="ml-4 mr-2 max-w-[60%] rounded-md bg-white px-3 py-2">
          {!!message.message.content && (
            <div className=" rounded-md bg-white">{message.message.content}</div>
          )}
          {message.message.files?.map((file, index) => (
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

export default MyMessage;
