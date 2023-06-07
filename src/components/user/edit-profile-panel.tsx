'use client';

import { Button, Form, Input, Typography } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useId, useState } from 'react';

import { Avatar } from '@/components/common/avatar';
import { CameraOutlined } from '@ant-design/icons';
import { User } from '@/types/user';

export interface EditProfilePanelProps {
  user: User;
}

export const EditProfilePanel = ({ user }: EditProfilePanelProps) => {
  const { avatar, name } = user;
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);
  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const id = useId();
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* <ImgCrop rotationSlider>
          <Upload
            multiple={false}
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            maxCount={1}
          ></Upload>
        </ImgCrop> */}
        <Avatar src={avatar} size="xLarge" alt={name} />
        <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-white">
          <Button shape="circle" type="default" icon={<CameraOutlined />} />
        </div>
        <input type="file" hidden />
      </div>
      <Typography.Title level={4}>{user.name}</Typography.Title>
      <Form className="w-full">
        <Form.Item>
          <Input.TextArea
            bordered={false}
            placeholder="Bio"
            showCount
            autoSize={{ minRows: 1, maxRows: 5 }}
            maxLength={70}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
