import { Room } from '@/types/room';
import { User } from '@/types/user';

export const users: User[] = [
  {
    id: '1',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    email: 'nhatyugioh@gmail.com',
    username: 'Nguyễn Minh Nhat',
    role: 'admin',
    status: 'active',
  },
  {
    id: '2',
    avatar:
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    email: 'oanh@gmail.com',
    username: 'Trần Thị Kim Oanh',
    status: 'active',
    role: 'user',
  },
  {
    id: '3',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80',
    email: 'duc@gmail.com',
    username: 'Nguyễn Trung Đức',
    status: 'active',
    role: 'user',
  },
  {
    id: '4',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=461&q=80',
    email: 'vi@gmail.com',
    username: 'Nguyễn Thị Khánh Vi',
    status: 'active',
    role: 'user',
  },
];

export const user: User = users[0];

export const rooms: Room[] = [
  {
    id: 1,
    name: 'Room 1',
    description: 'Room 1 description',
    isGroup: false,
    participant: [users[0], users[1]],
    lastMessage: {
      id: 1,
      read: false,
      content: 'Last message',
      createdAt: '2021-10-10T00:00:00.000Z',
      user: users[0],
    },
  },
  {
    id: 2,
    name: 'Room 1',
    description: 'Room 1 description',
    isGroup: true,
    participant: users,
    admin: users[0],
    lastMessage: {
      id: 3,
      read: false,
      content: 'Last message lkajsfdlkjas lkajsdfla laksjfd;lkasjdf;laksjdflaksjdflaksjfd;la',
      createdAt: '2021-10-10T00:00:00.000Z',
      user: users[2],
    },
  },
  {
    id: 2,
    name: 'Room 1',
    description: 'Room 1 description',
    isGroup: false,
    participant: [users[0], users[2]],
    lastMessage: {
      id: 3,
      read: false,
      content: 'Last message lkajsfdlkjas lkajsdfla laksjfd;lkasjdf;laksjdflaksjdflaksjfd;la',
      createdAt: '2021-10-10T00:00:00.000Z',
      user: users[2],
    },
  },
];
