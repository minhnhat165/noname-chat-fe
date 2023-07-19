import { Dispatch, SetStateAction, useState } from 'react';
import { useSidebar } from '../layout/sidebar';
import { UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import { ArrowLeftOutlined, ArrowRightOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, Drawer, Input, Upload } from 'antd';
import { Avatar } from '@/components/common/avatar';
import ImgCrop from 'antd-img-crop';

export const GroupName = ({
  avatar,
  isEdit,
  groupName,
  setGroupName,
  setCroppedFile,
}: {
  isEdit?: boolean | undefined;
  avatar?: string | undefined;
  groupName: string | undefined;
  setGroupName: Dispatch<SetStateAction<string | undefined>>;
  setCroppedFile: Dispatch<SetStateAction<Blob | undefined>>;
}) => {
  const { isCreateGroup, setIsCreateGroup, setIsSearch, setSearchValue, setIsStep2CreateGroup } =
    useSidebar();
  const [imgPreview, setImgPreview] = useState<string | undefined>(isEdit ? avatar : undefined);

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

  return (
    <div className="mb-3 bg-white px-3 pb-3">
      <div className="z-50 flex h-14 items-center justify-start bg-white px-4">
        {!isEdit ? (
          <Button
            onClick={() => {
              setIsCreateGroup(false);
              setIsStep2CreateGroup(false);
            }}
            type="text"
            className="mr-4"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            size="large"
          />
        ) : (
          ''
        )}
        <div>
          <p className="text-lg font-bold">{!isEdit ? 'New Group' : 'Edit Group'}</p>
        </div>
      </div>
      <div className="relative flex justify-center py-6">
        <Avatar bordered src={imgPreview} size="xLarge" alt={groupName} />
        <ImgCrop rotationSlider>
          <Upload
            multiple={false}
            maxCount={1}
            onPreview={onPreview}
            showUploadList={false}
            customRequest={({ file }) => {
              const newFile = file as Blob;
              console.log('file', newFile);
              setCroppedFile(newFile);
              setImgPreview(URL.createObjectURL(newFile));
            }}
          >
            <div className="relative right-5 top-20 flex items-center justify-center rounded-full bg-white">
              <Button shape="circle" type="default" icon={<CameraOutlined />} />
            </div>
          </Upload>
        </ImgCrop>
      </div>
      <div>
        <Input
          size="large"
          placeholder="Group Name ..."
          allowClear
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
