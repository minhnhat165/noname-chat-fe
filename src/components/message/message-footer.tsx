import { messageApi } from '@/services/message-services';
import { MessageType } from '@/types/message';
import { uploadImage } from '@/utils/upload-image';
import {
  FileImageOutlined,
  FileTextOutlined,
  LinkOutlined,
  SmileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Dropdown, MenuProps, Upload, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { RcFile } from 'antd/es/upload';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = { roomId: string };

const MessageFooter = (props: Props) => {
  const [inputChat, setInputChat] = useState('');
  const [displayEmoji, setDisplayEmoji] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputElement = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [selectType, setSelectType] = useState(MessageType.TEXT);
  const labelImage = useRef<HTMLButtonElement>(null);
  const labelFile = useRef<HTMLButtonElement>(null);
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
  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case '1':
        setSelectType(MessageType.IMAGE);
        break;
      case '2':
        setSelectType(MessageType.FILE);
        break;
    }
  };

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
  //upload ảnh
  // const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [listFile, setListFile] = useState<UploadFile[]>([]);
  // const [imageList, setImageList] = useState<string[]>([]);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log('new', newFileList);
    setFileList(newFileList);
  };
  const onChangeFile: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log('new', newFileList);
    setListFile(newFileList);
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
  useMemo(() => {
    if (fileList.length === 0) setSelectType(MessageType.TEXT);
  }, [fileList]);
  useMemo(() => {
    if (listFile.length === 0) setSelectType(MessageType.TEXT);
  }, [listFile]);
  useEffect(() => {
    if (selectType === MessageType.IMAGE && labelImage.current) labelImage.current.click();
  }, [selectType]);
  useEffect(() => {
    if ((selectType === MessageType.FILE || selectType === MessageType.IMAGE) && labelFile.current)
      labelFile.current.click();
  }, [selectType]);
  //   const myInput = useRef<HTMLButtonElement>(null);
  //   useEffect(() => {
  //     if (myInput.current) {
  //       myInput.current.click();
  //     }
  //   }, []);
  //   return (
  //     <div>
  //       <button
  //         ref={myInput}
  //         onClick={() => {
  //           console.log('object');
  //         }}
  //       >
  //         hihi
  //       </button>
  //     </div>
  //   );
  const submit = async (list: UploadFile[]) => {
    console.log('lits', list);
    let listTemp: string[] = [];
    if (list.length > 0) {
      // for (let file of fileList) {
      //   let { secure_url } = await uploadImage(file.originFileObj as Blob);
      //   imageList = [...imageList, secure_url];
      // }
      const resultPromise: any = [];
      list.forEach((file) => resultPromise.push(uploadImage(file.originFileObj as Blob)));
      const result = await Promise.all(resultPromise);
      console.log('res', result);
      listTemp = result.map((image) => image.secure_url);
    }
    return listTemp;
  };

  const handleEnter = async () => {
    let type = MessageType.TEXT;
    let list: string[] = [];
    if (selectType === MessageType.IMAGE) {
      type = MessageType.IMAGE;
      list = await submit(listFile);
    } else if (selectType === MessageType.FILE) {
      console.log('hihi');
      type = MessageType.FILE;
      console.log(fileList);
      list = await submit(fileList);
    }

    const message = {
      content: inputElement?.current?.value,
      type: type,
      room: props.roomId,
      images: type === MessageType.IMAGE ? list : [],
      files: type === MessageType.FILE ? list : [],
    };
    setInputChat('');
    setFileList([]);
    setSelectType(MessageType.TEXT);
    // mutation.mutate(message);
  };
  return (
    <div className="mb-5 mt-2 h-fit w-[730px] flex-shrink-0 rounded-lg bg-white">
      <div className=" flex min-h-[56px] w-full items-center">
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
        <div className="block h-fit flex-1 ">
          {/* test */}
          {selectType === MessageType.IMAGE && (
            <Upload
              listType="picture-card"
              accept="image/png, image/jpeg"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
            >
              <button type="button" ref={labelImage}>
                + Upload
              </button>
            </Upload>
          )}
          {/* end test */}
          {selectType === MessageType.FILE && (
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              className="flex gap-12 "
              accept=".pdf, .txt, .docx"
              onChange={onChangeFile}
            >
              <button type="button" ref={labelFile}>
                + Upload
              </button>
            </Upload>
          )}

          <input
            placeholder="Message"
            className="block h-12 w-full text-black focus:outline-none"
            value={inputChat}
            onChange={(e) => {
              setInputChat(e.target.value);
            }}
            ref={inputElement}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEnter();
              }
            }}
          />
        </div>

        <div className="relative flex h-9 w-14 items-center justify-center">
          <Dropdown
            overlayClassName="w-40"
            menu={{ items: sendFileItem, onClick }}
            placement="topRight"
          >
            <LinkOutlined className="text-[22px] text-gray-500 hover:cursor-pointer hover:text-cyan-600" />
          </Dropdown>

          {/* <input
            onChange={(e) => {
              console.log('object', e.target.value);
            }}
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
