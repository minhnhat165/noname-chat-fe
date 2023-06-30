import { Room } from '@/types/room';
import { User } from '@/types/user';

export function extractRoomByCurrentUser(room: Room, currentUser: User) {
  if (!room.isGroup) {
    const user: User = room.participants.find((user) => user._id !== currentUser._id) as User;
    if (!user) return room;
    room.avatar = user.avatar;
    room.name = user.username;
  } else {
    room.isAdmin = room.admin?._id === currentUser._id;
  }
  return room;
}

export const generateRoomByOtherUser = (user: User, me: User): Room => {
  return {
    _id: user._id,
    name: user.username,
    avatar: user.avatar,
    isGroup: false,
    participants: [me, user],
    isUser: true,
  };
};
