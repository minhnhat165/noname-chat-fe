'use client';

import { Button, Form, Input } from 'antd';
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import { HTMLAttributes, forwardRef, useImperativeHandle, useState } from 'react';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

import { Avatar } from '@/components/common/avatar';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';
import { User } from '@/types/user';
import { uploadImage } from '@/utils/upload-image';

export interface EditProfilePanelProps {
  user: User;
}

export type EditProfilePanelRef = {
  submit: () => Promise<User>;
} & HTMLAttributes<HTMLDivElement>;

export const EditProfilePanel = forwardRef<EditProfilePanelRef, EditProfilePanelProps>(
  ({ user }, ref) => {
    const { avatar, username } = user;
    const [form] = Form.useForm();
    const [croppedFile, setCroppedFile] = useState<Blob>();
    const [imgPreview, setImgPreview] = useState<string | undefined>(avatar);
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
    const submit = async () => {
      const values = await form.validateFields();
      const { username, bio } = values;
      const updateData: Partial<User> = { username, bio };
      if (croppedFile) {
        const { secure_url } = await uploadImage(croppedFile);
        updateData.avatar = secure_url;
      }
      return updateData as User;
    };
    useImperativeHandle(ref, () => ({
      submit,
    }));

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar bordered src={imgPreview} size="xLarge" alt={username} />
          <ImgCrop rotationSlider>
            <Upload
              multiple={false}
              maxCount={1}
              onPreview={onPreview}
              showUploadList={false}
              customRequest={({ file }) => {
                const newFile = file as Blob;
                setCroppedFile(newFile);
                setImgPreview(URL.createObjectURL(newFile));
              }}
            >
              <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-white">
                <Button shape="circle" type="default" icon={<CameraOutlined />} />
              </div>
            </Upload>
          </ImgCrop>
        </div>
        <Form form={form} className="mt-4 w-full">
          <Form.Item
            name="username"
            initialValue={username}
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input prefix={<UserOutlined />} size="large" placeholder="Name" />
          </Form.Item>
          <Form.Item name="bio">
            <Input.TextArea
              size="large"
              placeholder="Bio"
              showCount
              autoSize={{ minRows: 2, maxRows: 5 }}
              maxLength={70}
            />
          </Form.Item>
        </Form>
      </div>
    );
  },
);

EditProfilePanel.displayName = 'EditProfilePanel';
