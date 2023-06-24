import { Message } from '@/types/message';
import { User } from '@/types/user';
import { Avatar } from 'antd';

type Props = {
  messages: Message[];
  index: number;
};

const _id = '6492b1c0867f0cdeb5fc2869';
export const DisplayName = ({ messages, index }: Props) => {
  const message = messages[index];
  return message === messages[messages.length - 1] ||
    (message.sender as User)._id !== (messages[index + 1].sender as User)._id ? (
    <div className="ml-[46px]">{(message.sender as User).username}</div>
  ) : (
    <></>
  );
};

export const DisplayAvatar = ({ messages, index }: Props) => {
  const message = messages[index];
  return message === messages[0] ||
    (message.sender as User)._id !== (messages[index - 1].sender as User)._id ? (
    <Avatar size={34} src={(message.sender as User).avatar} />
  ) : (
    <></>
  );
};
